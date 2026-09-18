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
}): Tramite {
  const areaSlug = resolveAreaSlug(row.area_slug);
  const need = resolveNeed(row.need, areaSlug);
  const imageUrl = row.image_url?.trim() ?? "";
  const kind = row.kind === "pagos" ? "pagos" : "form";
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
    formFields: kind === "pagos" ? [] : parseTramiteFormFields(row.form_fields),
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
      summary, who, how, requirements, notes, form_fields
    FROM site_tramites
    WHERE published = true
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
        summary, who, how, requirements, notes, form_fields
      FROM site_tramites
      WHERE published = true AND slug = ${slug}
      LIMIT 1
    `;
    const row = rowsOf(result).find(isTramiteRow);
    return row ? mapRow(row) : null;
  } catch (error) {
    console.error("No se pudieron leer los trámites de Neon", error);
    return null;
  }
}
