import "server-only";
import { bookingAvailability } from "./booking-availability";
import { neon } from "@neondatabase/serverless";
import { unstable_noStore as noStore } from "next/cache";
import { areas, getArea } from "@/content/areas";
import { needs, type NeedId } from "@/content/needs";
import { parseTramiteFormFields } from "@/lib/tramite-form";
import {
  FALLBACK_AREA_SLUG,
  FALLBACK_NEED,
  type Tramite,
} from "@/lib/tramite";

export type { Tramite, TramiteImage } from "@/lib/tramite";
export { areaOf } from "@/lib/tramite";

function isNeedId(value: string): value is NeedId {
  return needs.some((item) => item.id === value);
}

function isAreaSlug(value: string) {
  return areas.some((item) => item.slug === value);
}

function resolveAreaSlug(value: string) {
  return isAreaSlug(value) ? value : FALLBACK_AREA_SLUG;
}

function resolveNeed(need: string, areaSlug: string): NeedId {
  if (isNeedId(need)) return need;
  return getArea(areaSlug)?.need ?? FALLBACK_NEED;
}

function isTramiteRow(row: Record<string, unknown>): row is {
  slug: string;
  title: string;
  need: string;
  area_slug: string;
  kind: string | null;
  image_url: string | null;
  image_alt: string | null;
  summary: string | null;
  who: string | null;
  how: string | null;
  requirements: string | null;
  notes: string | null;
  form_fields: unknown;
  type_config: unknown;
  booking_counts: Record<string, number> | null;
  accepts_submissions: boolean;
} {
  return (
    typeof row.slug === "string" &&
    typeof row.title === "string" &&
    typeof row.need === "string" &&
    typeof row.area_slug === "string"
  );
}

function mapRow(row: {
  slug: string;
  title: string;
  need: string;
  area_slug: string;
  kind: string | null;
  image_url: string | null;
  image_alt: string | null;
  summary: string | null;
  who: string | null;
  how: string | null;
  requirements: string | null;
  notes: string | null;
  form_fields: unknown;
  type_config: unknown;
  booking_counts: Record<string, number> | null;
  accepts_submissions: boolean;
}): Tramite {
  const areaSlug = resolveAreaSlug(row.area_slug);
  const need = resolveNeed(row.need, areaSlug);
  const imageUrl = row.image_url?.trim() ?? "";
  const kind = ["turnos", "documentos", "pagos"].includes(row.kind ?? "") ? row.kind as Tramite["kind"] : "form";
  const formFields = kind === "pagos" ? [] : parseTramiteFormFields(row.form_fields);
  let fullBookingDates: { id: string; label: string }[] = [];
  if (["turnos"].includes(kind)) {
    const config = row.type_config as { slots?: { id: string; date: string; capacity: number }[] } | null;
    const reservation = formFields.find(f => f.name === "reserva");
    const availability = bookingAvailability(config?.slots ?? [], row.booking_counts, reservation?.options ?? []);
    fullBookingDates = availability.fullDates;
    if (reservation) reservation.options = availability.options;
  }
  return {
    slug: row.slug,
    title: row.title,
    need,
    areaSlug,
    kind,
    image: imageUrl
      ? { src: imageUrl, alt: row.image_alt?.trim() || row.title }
      : undefined,
    summary: row.summary ?? "",
    who: row.who ?? "",
    how: row.how ?? "",
    requirements: row.requirements ?? "",
    notes: row.notes ?? "",
    formFields,
    fullBookingDates,
    documents: documentLinks(row.type_config),
    acceptsSubmissions: ["form", "turnos"].includes(row.kind ?? "") && row.accepts_submissions === true &&
      formFields.length > 0 && (!["turnos"].includes(kind) || Boolean(formFields.find(f => f.name === "reserva")?.options?.length)) && (isAreaSlug(row.area_slug) || row.area_slug === "general"),
  };
}

function rowsOf(result: unknown): Record<string, unknown>[] {
  if (!Array.isArray(result)) return [];
  return result.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null && !Array.isArray(row),
  );
}

async function queryPublished(
  url: string,
  areaSlug?: string,
): Promise<Tramite[]> {
  const sql = neon(url);
  const result = await sql`
    SELECT slug, title, need, area_slug, kind, image_url, image_alt,
      summary, who, how, requirements, notes, form_fields, type_config,
      (SELECT jsonb_object_agg(counts.slot, counts.total) FROM
        (SELECT answers->>'reserva' AS slot, count(*)::int AS total FROM site_tramite_submissions WHERE tramite_id = site_tramites.id AND answers->>'reserva' IS NOT NULL GROUP BY answers->>'reserva') counts) AS booking_counts,
      (notification_email IS NOT NULL AND length(btrim(notification_email)) <= 254 AND
        btrim(notification_email) ~ '^(?![.])(?!.*[.][.])[A-Za-z0-9_''+.-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*[.])+[A-Za-z]{2,}$') AS accepts_submissions
    FROM site_tramites
    WHERE published = true AND archived_at IS NULL
    ORDER BY sort_order ASC, published_at DESC NULLS LAST, created_at DESC
  `;

  const mapped = rowsOf(result).filter(isTramiteRow).map(mapRow);
  if (!areaSlug) return mapped;
  return mapped.filter((item) => item.areaSlug === areaSlug);
}

async function loadPublished(areaSlug?: string): Promise<Tramite[]> {
  noStore();
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    return await queryPublished(url, areaSlug);
  } catch (error) {
    console.error("No se pudieron leer los trámites de Neon", error);
    return [];
  }
}

export async function listPublishedTramites(): Promise<Tramite[]> {
  return loadPublished();
}

export async function listPublishedTramitesByArea(
  areaSlug: string,
): Promise<Tramite[]> {
  return loadPublished(areaSlug);
}

export async function getPublishedTramite(
  slug: string,
): Promise<Tramite | null> {
  noStore();
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  try {
    const sql = neon(url);
    const result = await sql`
      SELECT slug, title, need, area_slug, kind, image_url, image_alt,
        summary, who, how, requirements, notes, form_fields, type_config,
      (SELECT jsonb_object_agg(counts.slot, counts.total) FROM
        (SELECT answers->>'reserva' AS slot, count(*)::int AS total FROM site_tramite_submissions WHERE tramite_id = site_tramites.id AND answers->>'reserva' IS NOT NULL GROUP BY answers->>'reserva') counts) AS booking_counts,
        (notification_email IS NOT NULL AND length(btrim(notification_email)) <= 254 AND
          btrim(notification_email) ~ '^(?![.])(?!.*[.][.])[A-Za-z0-9_''+.-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*[.])+[A-Za-z]{2,}$') AS accepts_submissions
      FROM site_tramites
      WHERE published = true AND archived_at IS NULL AND slug = ${slug}
      LIMIT 1
    `;
    const row = rowsOf(result).find(isTramiteRow);
    return row ? mapRow(row) : null;
  } catch (error) {
    console.error("No se pudieron leer los trámites de Neon", error);
    return null;
  }
}

function documentLinks(raw: unknown): NonNullable<Tramite["documents"]> {
  if (!raw || typeof raw !== "object" || !("documents" in raw) || !Array.isArray(raw.documents)) return [];
  return raw.documents.filter((d): d is {title:string;url:string} => {
    if (!d || typeof d.title !== "string" || typeof d.url !== "string") return false;
    try { const url = new URL(d.url); return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname) && /^\/api\/public\/tramites\/[0-9a-f-]+\/documents\/[0-9a-f-]+$/.test(url.pathname)); } catch { return false; }
  });
}
