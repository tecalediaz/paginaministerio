import { createHmac, randomUUID } from "node:crypto";
import { getArea } from "../content/areas";
import {
  parseTramiteFormFields, validateTramiteForm,
  type TramiteFormField, type TramiteFormState,
} from "./tramite-form";

export type SubmissionConfig = {
  id: string; slug: string; title: string; kind: string | null;
  published: boolean; archived_at: unknown; area_slug: string;
  notification_email: unknown; form_fields: unknown;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Same practical address syntax as the CMS's z.email(), without a public dependency.
const EMAIL = /^(?![.])(?!.*[.][.])[A-Za-z0-9_'+.-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*[.])+[A-Za-z]{2,}$/;

export function resolveSubmissionArea(slug: string): string | null {
  if (slug === "general") return "atencion-sede";
  return getArea(slug) ? slug : null;
}

export function validNotificationEmail(value: unknown): value is string {
  return typeof value === "string" && value.trim().length <= 254 && EMAIL.test(value.trim());
}

export function acceptsSubmissions(config: Pick<SubmissionConfig,
  "kind" | "published" | "archived_at" | "area_slug" | "notification_email" | "form_fields"
>): boolean {
  return config.published === true && config.archived_at === null && ["form", "inscripcion", "turnos"].includes(config.kind ?? "") &&
    resolveSubmissionArea(config.area_slug) !== null && validNotificationEmail(config.notification_email) &&
    parseTramiteFormFields(config.form_fields).length > 0;
}

function digest(secret: string, value: unknown) {
  return createHmac("sha256", secret).update(JSON.stringify(value)).digest("hex");
}

export function deriveSubmissionIdentity(
  attempt: string, slug: string, answers: Record<string, string>, client: string, secret: string,
) {
  const rateKey = digest(secret, ["rate-v1", client]);
  const canonicalAnswers = Object.keys(answers).sort().map((key) => [key, answers[key]]);
  return {
    rateKey,
    fingerprint: digest(secret, ["attempt-v1", attempt.toLowerCase(), slug, canonicalAnswers, rateKey]),
  };
}

export type SubmissionWrite = {
  id: string; tramiteId: string; idempotencyKey: string; requestFingerprint: string;
  rateKey: string; rawFields: unknown; fieldsSnapshot: TramiteFormField[];
  answers: Record<string, string>;
};
export type SubmissionPersistenceResult = {
  status: "accepted" | "replayed" | "rate_limited" | "unavailable" | "conflict" | "configuration_changed" | "full" | "already_booked" | "registration_full" | "already_registered" | "registration_closed" | "registration_not_open";
  receipt_id: string | null;
};
export type SubmissionRepository = {
  readAttempt(key: string): Promise<{ id: string; fields_snapshot: unknown; request_fingerprint: string } | null>;
  readConfig(slug: string): Promise<SubmissionConfig | null>;
  persist(write: SubmissionWrite): Promise<SubmissionPersistenceResult>;
};

const unavailable = () => ({ ok: false, errors: { form: "Este trámite no recibe solicitudes en este momento. Podés consultar por teléfono, WhatsApp o en sede." } });
const failed = () => ({ ok: false, errors: { form: "No pudimos confirmar el envío. Volvé a intentarlo con los mismos datos." } });

/** The DB boundary returns only a receipt and a bounded status, never submitted data. */
export async function receiveSubmission(
  formData: FormData, client: string, secret: string, repository: SubmissionRepository,
): Promise<TramiteFormState> {
  const slug = formData.get("slug");
  const attempt = formData.get("idempotency_key");
  if (typeof slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,159}$/.test(slug) ||
      typeof attempt !== "string" || !UUID.test(attempt) ||
      formData.getAll("slug").length !== 1 || formData.getAll("idempotency_key").length !== 1 ||
      formData.getAll("website").some((value) => typeof value !== "string" || value.trim() !== "")) {
    return failed();
  }
  try {
    // A committed receipt survives withdrawal or edits of the live form.
    // Validate only against its stored schema and never expose it to the client.
    const previous = await repository.readAttempt(attempt.toLowerCase());
    if (previous) {
      const validation = validateTramiteForm(formData, parseTramiteFormFields(previous.fields_snapshot));
      if (!validation.ok || !UUID.test(previous.id)) return failed();
      const identity = deriveSubmissionIdentity(attempt, slug, validation.answers, client, secret);
      if (identity.fingerprint !== previous.request_fingerprint) return failed();
      return { ok: true, errors: {}, receiptId: previous.id };
    }
    const config = await repository.readConfig(slug);
    if (!config || !acceptsSubmissions(config)) return unavailable();
    const fields = parseTramiteFormFields(config.form_fields);
    const validation = validateTramiteForm(formData, fields);
    if (!validation.ok) return validation;
    const identity = deriveSubmissionIdentity(attempt, slug, validation.answers, client, secret);
    const result = await repository.persist({
      id: randomUUID(), tramiteId: config.id, idempotencyKey: attempt.toLowerCase(),
      requestFingerprint: identity.fingerprint, rateKey: identity.rateKey,
      rawFields: config.form_fields, fieldsSnapshot: fields, answers: validation.answers,
    });
    if ((result.status === "accepted" || result.status === "replayed") &&
        typeof result.receipt_id === "string" && UUID.test(result.receipt_id)) {
      return { ok: true, errors: {}, receiptId: result.receipt_id };
    }
    if (result.status === "registration_full") return { ok: false, unavailableDate: true, errors: { form: "Se completaron todos los lugares de esta inscripción." } };
    if (result.status === "registration_closed" || result.status === "registration_not_open") return { ok: false, unavailableDate: true, errors: { form: "La inscripción no está abierta en este momento." } };
    if (result.status === "already_registered") return { ok: false, errors: { dni: "Este DNI ya tiene una inscripción confirmada." } };
    if (result.status === "rate_limited") return {
      ok: false, errors: { form: "Alcanzaste el límite de envíos. Esperá diez minutos y volvé a intentarlo." },
    };
    if (result.status === "full") return { ok: false, unavailableDate: true, errors: { form: "El último lugar se ocupó. Elegí otra fecha o consultá al área." } };
    if (result.status === "already_booked") return { ok: false, errors: { form: "Ya hay una reserva para este DNI en la fecha elegida." } };
    if (result.status === "unavailable") return unavailable();
    if (result.status === "configuration_changed") return {
      ok: false, errors: { form: "El formulario cambió. Actualizá la página antes de volver a enviarlo." },
    };
    return failed();
  } catch {
    // Personal data and DB connection details must not enter application logs.
    return failed();
  }
}
