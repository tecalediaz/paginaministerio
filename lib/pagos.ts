import { neon } from "@neondatabase/serverless";

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

function rowsOf(result: unknown): Record<string, unknown>[] {
  if (!Array.isArray(result)) return [];
  return result.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null && !Array.isArray(row),
  );
}

function isPagoRow(row: Record<string, unknown>): row is {
  id: string;
  programa: string;
  periodo: string;
  scheduled_at: Date | string;
  paid_at: Date | string | null;
  note: string | null;
} {
  return (
    typeof row.id === "string" &&
    typeof row.programa === "string" &&
    typeof row.periodo === "string" &&
    (row.scheduled_at instanceof Date || typeof row.scheduled_at === "string")
  );
}

function isoOf(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString();
}

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

export async function listPublishedPagos(
  tramiteSlug: string,
): Promise<PagoPublico[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    const sql = neon(url);
    const result = await sql`
      SELECT p.id, p.programa, p.periodo, p.scheduled_at, p.paid_at, p.note
      FROM site_tramite_pagos p
      INNER JOIN site_tramites t ON t.id = p.tramite_id
      WHERE t.published = true
        AND t.slug = ${tramiteSlug}
        AND p.published = true
      ORDER BY p.scheduled_at DESC, p.created_at DESC
    `;
    return rowsOf(result)
      .filter(isPagoRow)
      .map((row) => ({
        id: row.id,
        programa: row.programa,
        periodo: row.periodo,
        scheduledAt: isoOf(row.scheduled_at),
        paidAt: row.paid_at ? isoOf(row.paid_at) : null,
        note: row.note?.trim() ?? "",
      }));
  } catch (error) {
    console.error("No se pudieron leer las acreditaciones de Neon", error);
    return [];
  }
}
