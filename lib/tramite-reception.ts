import "server-only";
import { isIP } from "node:net";
import { neon } from "@/lib/postgres";
import {
  receiveSubmission, type SubmissionConfig, type SubmissionPersistenceResult,
} from "./tramite-reception-core";
import type { TramiteFormState } from "./tramite-form";

/** Only use a header overwritten by the hosting proxy. Missing IPs share a safe cap. */
function submissionClient(headers: Pick<Headers, "get">): string {
  const header = process.env.SUBMISSION_TRUSTED_IP_HEADER || "x-nf-client-connection-ip";
  const value = headers.get(header)?.trim() ?? "";
  return isIP(value) ? value : "unknown-client";
}

export async function saveTramiteSubmission(
  formData: FormData, headers: Pick<Headers, "get">,
): Promise<TramiteFormState> {
  const url = process.env.DATABASE_URL;
  const secret = process.env.SUBMISSION_RATE_LIMIT_SECRET;
  if (!url || !secret || secret.length < 32) return {
    ok: false, errors: { form: "El envío de solicitudes no está disponible en este momento. Podés consultar por teléfono, WhatsApp o en sede." },
  };
  const sql = neon(url);
  return receiveSubmission(formData, submissionClient(headers), secret, {
    async readAttempt(key) {
      const rows = await sql`SELECT id, fields_snapshot, request_fingerprint FROM site_tramite_submissions WHERE idempotency_key = ${key}::uuid LIMIT 1`;
      return (rows[0] as { id: string; fields_snapshot: unknown; request_fingerprint: string } | undefined) ?? null;
    },
    async readConfig(slug) {
      const result = await sql`
        SELECT id, slug, title, kind, published, archived_at, area_slug, notification_email, form_fields
        FROM site_tramites WHERE slug = ${slug} AND published = true AND archived_at IS NULL LIMIT 1
      `;
      return (result[0] as SubmissionConfig | undefined) ?? null;
    },
    async persist(write) {
      const rows = await sql`
        SELECT status, receipt_id FROM public.receive_site_tramite_submission(
          ${write.id}::uuid, ${write.tramiteId}::uuid, ${write.idempotencyKey}::uuid,
          ${write.requestFingerprint}::text, ${write.rateKey}::text,
          ${JSON.stringify(write.rawFields)}::jsonb, ${JSON.stringify(write.fieldsSnapshot)}::jsonb,
          ${JSON.stringify(write.answers)}::jsonb
        )
      `;
      return (rows[0] as SubmissionPersistenceResult | undefined) ?? { status: "unavailable", receipt_id: null };
    },
  });
}
