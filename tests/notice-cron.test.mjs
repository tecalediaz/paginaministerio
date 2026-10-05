import test from "node:test";
import assert from "node:assert/strict";

let runNoticeCron;
let scheduledHandler;
let config;
try {
  ({ runNoticeCron, default: scheduledHandler, config } = await import("../netlify/functions/alministerio-avisos.mjs"));
} catch (error) {
  if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
}
const environment = {
  ALMINISTERIO_CRON_ENABLED: "true",
  ALMINISTERIO_CRON_URL: "https://al-ministerio.vercel.app/api/cron/tick",
  ALMINISTERIO_CRON_SECRET: "private-cron-secret",
};

test("the scheduled trigger exposes the executable handler", () => {
  assert.equal(typeof runNoticeCron, "function");
  assert.equal(typeof scheduledHandler, "function");
  assert.equal(config.schedule, "* * * * *");
});
test("an inactive trigger never contacts AlMinisterio", async () => {
  let calls = 0;
  assert.deepEqual(await runNoticeCron({}, async () => { calls++; }), { status: "disabled" });
  assert.equal(calls, 0);
});
test("the trigger sends its private secret only in a header and forbids redirects", async () => {
  let destination;
  let options;
  const result = await runNoticeCron(environment, async (url, init) => {
    destination = String(url);
    options = init;
    return Response.json({ ok: true, processed: 1 });
  });
  assert.equal(destination, "https://al-ministerio.vercel.app/api/cron/tick");
  assert.equal(options.headers.Authorization, "Bearer private-cron-secret");
  assert.equal(options.redirect, "error");
  assert.ok(options.signal instanceof AbortSignal);
  assert.deepEqual(result, { status: "processed" });
});
test("invalid configuration cannot send its secret", async () => {
  for (const url of ["http://al-ministerio.vercel.app/api/cron/tick", "https://a.test/api/cron/tick?secret=x", "https://user:pass@a.test/api/cron/tick", "https://a.test/wrong", "https://a.test/api/cron/tick#fragment"]) {
    let calls = 0;
    await assert.rejects(runNoticeCron({ ...environment, ALMINISTERIO_CRON_URL: url }, async () => { calls++; }), /Configuración inválida/);
    assert.equal(calls, 0);
  }
  await assert.rejects(runNoticeCron({ ...environment, ALMINISTERIO_CRON_SECRET: "" }), /Configuración inválida/);
});
test("upstream failures never expose response contents or credentials", async () => {
  await assert.rejects(runNoticeCron(environment, async () => new Response("secret-from-provider", { status: 503 })), error => {
    assert.equal(error.message, "AlMinisterio no confirmó el cron (503).");
    return true;
  });
  await assert.rejects(runNoticeCron(environment, async () => { throw new Error("private-cron-secret"); }), error => {
    assert.equal(error.message, "No se pudo confirmar el cron de AlMinisterio.");
    return true;
  });
});
test("automation bypass is optional and remains in a private header", async () => {
  await runNoticeCron({ ...environment, ALMINISTERIO_AUTOMATION_BYPASS_SECRET: "private-bypass" }, async (_url, init) => {
    assert.equal(init.headers["x-vercel-protection-bypass"], "private-bypass");
    return Response.json({ ok: true });
  });
});
test("HTTP 200 without an explicit queue confirmation is not accepted", async () => {
  for (const response of [Response.json({ ok: false }), Response.json({}), new Response("not-json")]) {
    await assert.rejects(runNoticeCron(environment, async () => response), /AlMinisterio no confirmó el procesamiento/);
  }
});
