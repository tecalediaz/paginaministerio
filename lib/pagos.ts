export const ART_TZ = "America/Argentina/La_Rioja";

export type PagoStatus = "scheduled" | "paid";

export type PagoPublico = {
  id: string;
  programa: string;
  periodo: string;
  scheduledAt: string;
  paidAt: string | null;
  note: string;
};

export function derivePagoStatus(
  scheduledAt: Date,
  paidAt: Date | null,
  now = new Date(),
): PagoStatus {
  if (paidAt) return "paid";
  if (scheduledAt.getTime() <= now.getTime()) return "paid";
  return "scheduled";
}

function dateParts(value: Date) {
  const parts = new Intl.DateTimeFormat("es-AR", {
    timeZone: ART_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    day: get("day"),
    month: get("month"),
    year: get("year"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function formatDiaMes(value: Date, includeYear: boolean) {
  const { day, month, year } = dateParts(value);
  if (includeYear) return `${day} de ${month} de ${year}`;
  return `${day} de ${month}`;
}

function formatHora(value: Date) {
  const { hour, minute } = dateParts(value);
  if (hour === "00" && minute === "00") return null;
  return `${hour}:${minute}`;
}

export function formatPagoEstado(
  scheduledAt: Date,
  paidAt: Date | null,
  now = new Date(),
): { status: PagoStatus; label: string } {
  const status = derivePagoStatus(scheduledAt, paidAt, now);
  const includeYear = dateParts(scheduledAt).year !== dateParts(now).year;
  const dia = formatDiaMes(scheduledAt, includeYear);
  const hora = formatHora(scheduledAt);
  if (status === "scheduled") {
    return {
      status,
      label: hora ? `Se pagará el ${dia} a las ${hora}` : `Se pagará el ${dia}`,
    };
  }
  return {
    status,
    label: hora ? `Acreditado el ${dia} a las ${hora}` : `Acreditado el ${dia}`,
  };
}

