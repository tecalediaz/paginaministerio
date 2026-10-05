import assert from "node:assert/strict";
import { test } from "node:test";
import { validateTramiteForm, type TramiteFormField } from "../lib/tramite-form";
import * as reception from "../lib/tramite-reception-core";

const fields: TramiteFormField[] = [
  { id: "1", name: "nombre", label: "Nombre", type: "text", required: true },
  { id: "2", name: "dni", label: "DNI", type: "dni", required: true, maxLength: 8 },
  { id: "3", name: "telefono", label: "Teléfono", type: "tel", required: true },
  { id: "4", name: "opcion", label: "Opción", type: "select", required: true, options: [{ value: "si", label: "Sí" }] },
];

function form() {
  const data = new FormData();
  data.set("slug", "consulta");
  data.set("idempotency_key", "90d8df7c-9ac3-4dca-a619-fc32f472d470");
  data.set("nombre", "  Juan  Pérez ");
  data.set("dni", "12.345.678");
  data.set("telefono", "+54 380 123-4567");
  data.set("opcion", "si");
  data.set("notification_email", "atacante@example.com");
  return data;
}

const config = {
  id: "797e8ba8-e8d4-4c4f-a5dc-0c39e5d25f8b", slug: "consulta", title: "Consulta",
  kind: "form", published: true, archived_at: null, area_slug: "general",
  notification_email: "  area@example.com ", form_fields: fields,
};

test("validated values include normalized answers and exclude client routing data", () => {
  const result = validateTramiteForm(form(), fields);
  assert.equal(result.ok, true);
  assert.deepEqual(result.ok ? result.answers : undefined, {
    nombre: "Juan Pérez", dni: "12345678", telefono: "543801234567", opcion: "si",
  });
});

test("invalid select values and required fields never produce accepted answers", () => {
  const data = form();
  data.set("opcion", "otra");
  data.delete("nombre");
  const result = validateTramiteForm(data, fields);
  assert.equal(result.ok, false);
  assert.ok(result.errors.nombre);
  assert.ok(result.errors.opcion);
});

test("recipient eligibility uses only published form configuration and known areas", () => {
  assert.equal(reception.acceptsSubmissions(config), true);
  for (const change of [
    { notification_email: null }, { notification_email: "a@example.com\nBcc:x@example.com" },
    { notification_email: "<a@example.com>" }, { notification_email: ".a@example.com" },
    { notification_email: "a..b@example.com" }, { notification_email: "a@example.c" },
    { area_slug: "otra" }, { form_fields: [] }, { kind: "pagos" },
    { published: false }, { archived_at: "2026-09-28" },
  ]) assert.equal(reception.acceptsSubmissions({ ...config, ...change }), false);
  assert.equal(reception.resolveSubmissionArea("general"), "atencion-sede");
});

test("an attempt is bound to the submitting client and exact submitted answers", () => {
  const data = form();
  const first = reception.deriveSubmissionIdentity(String(data.get("idempotency_key")), "consulta", { nombre: "Juan Pérez" }, "client-a", "secret");
  assert.deepEqual(reception.deriveSubmissionIdentity(String(data.get("idempotency_key")), "consulta", { nombre: "Juan Pérez" }, "client-a", "secret"), first);
  assert.notEqual(reception.deriveSubmissionIdentity(String(data.get("idempotency_key")), "consulta", { nombre: "Juan Pérez" }, "client-b", "secret").fingerprint, first.fingerprint);
  assert.notEqual(reception.deriveSubmissionIdentity(String(data.get("idempotency_key")), "consulta", { nombre: "Otra Persona" }, "client-a", "secret").fingerprint, first.fingerprint);
});

test("persistence receives a historical snapshot and authority never comes from client fields", async () => {
  let saved: reception.SubmissionWrite | undefined;
  const result = await reception.receiveSubmission(form(), "client-a", "secret", {
    readAttempt: async () => null,
    readConfig: async () => config,
    persist: async (write) => {
      saved = write;
      return { status: "accepted", receipt_id: write.id };
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.receiptId, saved?.id);
  assert.equal(saved?.tramiteId, config.id);
  assert.deepEqual(saved?.fieldsSnapshot, fields);
  assert.equal(saved?.answers.dni, "12345678");
  assert.equal("recipient" in (saved ?? {}), false);
  assert.equal("notification_email" in (saved?.answers ?? {}), false);
});

test("DB failure, rate cap, stale config and conflicting attempt never confirm receipt", async () => {
  for (const status of ["rate_limited", "unavailable", "conflict", "configuration_changed"] as const) {
    const result = await reception.receiveSubmission(form(), "client-a", "secret", {
      readAttempt: async () => null,
      readConfig: async () => config,
      persist: async () => ({ status, receipt_id: null }),
    });
    assert.equal(result.ok, false);
    assert.equal(result.receiptId, undefined);
  }
  const result = await reception.receiveSubmission(form(), "client-a", "secret", {
    readAttempt: async () => null,
    readConfig: async () => config,
    persist: async () => { throw new Error("offline"); },
  });
  assert.equal(result.ok, false);
  assert.equal(result.receiptId, undefined);
});

test("an identical committed retry returns its original receipt without exposing answers", async () => {
  const receipt = "6aa2b42c-a2b3-4320-b8f0-6c22ee785e28";
  const result = await reception.receiveSubmission(form(), "client-a", "secret", {
    readAttempt: async () => null,
    readConfig: async () => config,
    persist: async () => ({ status: "replayed", receipt_id: receipt }),
  });
  assert.deepEqual(result, { ok: true, errors: {}, receiptId: receipt });
});

test("answer property order cannot change the identity of a retry", () => {
  const attempt = "90d8df7c-9ac3-4dca-a619-fc32f472d470";
  assert.deepEqual(
    reception.deriveSubmissionIdentity(attempt, "consulta", { nombre: "Juan Pérez", dni: "12345678" }, "client-a", "secret"),
    reception.deriveSubmissionIdentity(attempt, "consulta", { dni: "12345678", nombre: "Juan Pérez" }, "client-a", "secret"),
  );
});

test("different attempts and forms from one client share the persistent rate cap", () => {
  const first = reception.deriveSubmissionIdentity("90d8df7c-9ac3-4dca-a619-fc32f472d470", "consulta", { dni: "12345678" }, "198.51.100.42", "secret");
  const next = reception.deriveSubmissionIdentity("3bb37d50-8c0c-4259-9c1f-94ba8e56c658", "otra-consulta", { dni: "87654321" }, "198.51.100.42", "secret");
  assert.equal(first.rateKey, next.rateKey);
  assert.notEqual(first.fingerprint, next.fingerprint);
  assert.match(first.rateKey, /^[0-9a-f]{64}$/);
  assert.equal(first.rateKey.includes("198.51.100.42"), false);
});

test("honeypot, malformed attempt and unavailable config block any persistence", async () => {
  for (const mutation of [
    (data: FormData) => data.set("website", "bot"),
    (data: FormData) => data.set("idempotency_key", "invalid"),
    (data: FormData) => data.set("dni", "12"),
  ]) {
    const data = form(); mutation(data);
    const result = await reception.receiveSubmission(data, "client-a", "secret", {
      readAttempt: async () => null,
      readConfig: async () => config,
      persist: async () => { assert.fail("A rejected form must not be persisted"); },
    });
    assert.equal(result.ok, false);
  }
  const result = await reception.receiveSubmission(form(), "client-a", "secret", {
    readAttempt: async () => null,
    readConfig: async () => ({ ...config, notification_email: null }),
    persist: async () => { assert.fail("An unconfigured form must not be persisted"); },
  });
  assert.equal(result.ok, false);
});

test("committed retries survive withdrawal and schema edits without accepting other clients", async () => {
  const receipt = "6aa2b42c-a2b3-4320-b8f0-6c22ee785e28";
  const answers = validateTramiteForm(form(), fields);
  assert.equal(answers.ok, true);
  const identity = reception.deriveSubmissionIdentity(String(form().get("idempotency_key")), "consulta", answers.ok ? answers.answers : {}, "client-a", "secret");
  for (const current of [null, { ...config, form_fields: [...fields, { id: "new", name: "nuevo", label: "Nuevo requerido", type: "text", required: true }] }]) {
    const repository = {
      readAttempt: async () => ({ id: receipt, fields_snapshot: fields, request_fingerprint: identity.fingerprint }),
      readConfig: async () => current,
      persist: async () => { assert.fail("Existing committed attempts must not insert again"); },
    };
    assert.deepEqual(await reception.receiveSubmission(form(), "client-a", "secret", repository), { ok: true, errors: {}, receiptId: receipt });
    const conflict = await reception.receiveSubmission(form(), "client-b", "secret", repository);
    assert.equal(conflict.ok, false);
    assert.equal(conflict.receiptId, undefined);
    const altered = form(); altered.set("nombre", "Otra persona");
    assert.equal((await reception.receiveSubmission(altered, "client-a", "secret", repository)).ok, false);
  }
});


test("automatic booking accepts only reservation kinds and handles full or duplicate slots", async () => {
  assert.equal(reception.acceptsSubmissions({...config,kind:"turnos"}),true);
  assert.equal(reception.acceptsSubmissions({...config,kind:"actividad"}),false);
  assert.equal(reception.acceptsSubmissions({...config,kind:"documentos"}),false);
  for (const status of ["full","already_booked"] as const) {
    const result = await reception.receiveSubmission(form(), "test", "x".repeat(32), {
      readAttempt: async()=>null, readConfig: async()=>({...config,kind:"turnos"}),
      persist: async()=>({status,receipt_id:null}),
    });
    assert.equal(result.ok,false);
    assert.equal(result.unavailableDate, status === "full" ? true : undefined);
    assert.ok(result.errors.form);
  }
});
