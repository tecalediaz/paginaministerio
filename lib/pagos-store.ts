import "server-only";
import { sqlFor } from "@/lib/sql";
import type { PagoPublico } from "@/lib/pagos";

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

export async function listPublishedPagos(
  tramiteSlug: string,
): Promise<PagoPublico[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    const sql = sqlFor(url);
    const result = await sql`
      SELECT p.id, p.programa, p.periodo, p.scheduled_at, p.paid_at, p.note
      FROM site_tramite_pagos p
      INNER JOIN site_tramites t ON t.id = p.tramite_id
      WHERE t.published = true
        AND t.archived_at IS NULL
        AND t.deleted_at IS NULL
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
    console.error("No se pudieron leer las acreditaciones", error);
    return [];
  }
}
