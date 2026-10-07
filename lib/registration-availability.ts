export type RegistrationAvailability = {
  capacity: number; count: number; remaining: number;
  status: "open" | "scheduled" | "closed" | "full" | "unavailable";
  opensAt?: string; closesAt?: string;
};

export function registrationAvailability(raw: unknown, count: number, now = Date.now()): RegistrationAvailability {
  const unavailable: RegistrationAvailability = { capacity: 0, count, remaining: 0, status: "unavailable" };
  if (!raw || typeof raw !== "object") return unavailable;
  const config = raw as { capacity?: unknown; closed?: unknown; opensAt?: unknown; closesAt?: unknown };
  if (typeof config.capacity !== "number" || !Number.isInteger(config.capacity) || config.capacity < 1 || config.capacity > 100000 || !Number.isInteger(count) || count < 0) return unavailable;
  const opensAt = typeof config.opensAt === "string" ? config.opensAt : undefined;
  const closesAt = typeof config.closesAt === "string" ? config.closesAt : undefined;
  if ((opensAt && !Number.isFinite(Date.parse(opensAt))) || (closesAt && !Number.isFinite(Date.parse(closesAt))) || (opensAt && closesAt && Date.parse(closesAt) <= Date.parse(opensAt))) return unavailable;
  const remaining = Math.max(0, config.capacity - count);
  const status = config.closed === true || (closesAt && Date.parse(closesAt) <= now) ? "closed"
    : opensAt && Date.parse(opensAt) > now ? "scheduled" : !remaining ? "full" : "open";
  return { capacity: config.capacity, count, remaining, status, opensAt, closesAt };
}

export function registrationStatusMessage(value?: RegistrationAvailability): string {
  if (!value || value.status === "unavailable") return "La inscripción no está disponible en este momento. Podés consultar al área.";
  if (value.status === "full") return "Se completaron todos los lugares disponibles.";
  if (value.status === "closed") return "El plazo de inscripción está cerrado.";
  if (value.status === "scheduled" && value.opensAt) {
    return `La inscripción abre el ${new Intl.DateTimeFormat("es-AR", { timeZone: "America/Argentina/La_Rioja", dateStyle: "short", timeStyle: "short" }).format(new Date(value.opensAt))}.`;
  }
  return `${value.remaining} lugares disponibles de ${value.capacity}. Cada inscripción confirma un lugar.`;
}
