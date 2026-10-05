export async function runNoticeCron(environment = process.env, fetcher = fetch) {
  if (environment.ALMINISTERIO_CRON_ENABLED !== "true") return { status: "disabled" };
  const secret = environment.ALMINISTERIO_CRON_SECRET?.trim();
  let url;
  try {
    url = new URL(environment.ALMINISTERIO_CRON_URL);
  } catch {
    throw new Error("Configuración inválida del cron de AlMinisterio.");
  }
  if (!secret || url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/api/cron/tick") {
    throw new Error("Configuración inválida del cron de AlMinisterio.");
  }
  const headers = { Authorization: `Bearer ${secret}` };
  if (environment.ALMINISTERIO_AUTOMATION_BYPASS_SECRET) headers["x-vercel-protection-bypass"] = environment.ALMINISTERIO_AUTOMATION_BYPASS_SECRET;
  let response;
  try {
    response = await fetcher(url, { method: "GET", headers, redirect: "error", signal: AbortSignal.timeout(25000) });
  } catch {
    throw new Error("No se pudo confirmar el cron de AlMinisterio.");
  }
  if (!response.ok) throw new Error(`AlMinisterio no confirmó el cron (${response.status}).`);
  let confirmation;
  try {
    confirmation = await response.json();
  } catch {
    throw new Error("AlMinisterio no confirmó el procesamiento de avisos.");
  }
  if (confirmation?.ok !== true) throw new Error("AlMinisterio no confirmó el procesamiento de avisos.");
  return { status: "processed" };
}

export default async function scheduledNoticeCron() {
  const result = await runNoticeCron();
  console.log(JSON.stringify({ event: "alministerio-notice-cron", ...result }));
}

export const config = { schedule: "* * * * *" };
