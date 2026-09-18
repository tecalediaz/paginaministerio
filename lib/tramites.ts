import { neon } from "@neondatabase/serverless";
import { areas } from "@/content/areas";
import { needs, type NeedId } from "@/content/needs";
import { formatContactHours, site } from "@/content/site";
import { parseTramiteFormFields } from "@/lib/tramite-form";
import type { Tramite } from "@/lib/tramite";

export type { Tramite, TramiteImage } from "@/lib/tramite";
export { areaOf } from "@/lib/tramite";

export const LEGACY_TRAMITE_SLUGS: Record<string, string> = {
  "taller-lengua-de-senas": "manos-a-la-obra-panaderia",
};

const DEV_FIXTURES: Tramite[] = [
  {
    slug: "manos-a-la-obra-panaderia",
    title: "Inscripción al taller Manos a la obra panadería",
    need: "discapacidad",
    areaSlug: "discapacidad",
    kind: "form",
    image: {
      src: "/tramites/manosalaobra.png",
      alt: "Afiche del taller Manos a la obra panadería.",
    },
    summary:
      "Inscripción al taller Manos a la obra panadería, una capacitación práctica de panadería. Cupos y cronograma se confirman en sede.",
    who: "Personas con discapacidad intelectual a partir de los 18 años.",
    how: `Completá el formulario de esta ficha. Si necesitás consultar, usá teléfono, WhatsApp o acercate a la sede (${site.contact.address}, ${site.contact.city}). Horario: ${formatContactHours(site.contact.hours)}.`,
    requirements: "DNI.\nCompletar el formulario de inscripción.",
    notes:
      "El cronograma, los cupos y la confirmación de inscripción se informan en sede.",
    formFields: [
      {
        id: "nombre",
        name: "nombre",
        type: "text",
        label: "Nombre y apellido",
        required: true,
      },
      {
        id: "dni",
        name: "dni",
        type: "dni",
        label: "DNI",
        required: true,
      },
      {
        id: "email",
        name: "email",
        type: "email",
        label: "Correo electrónico",
        required: true,
      },
      {
        id: "telefono",
        name: "telefono",
        type: "tel",
        label: "Teléfono",
        required: true,
      },
      {
        id: "experiencia",
        name: "experiencia",
        type: "select",
        label: "Experiencia previa en panadería",
        required: true,
        options: [
          { value: "sin_experiencia", label: "Sin experiencia previa" },
          {
            value: "con_experiencia",
            label: "Con experiencia en panadería u oficios similares",
          },
        ],
      },
    ],
  },
  {
    slug: "acreditacion",
    title: "Acreditación",
    need: "territorio",
    areaSlug: "atencion-sede",
    kind: "pagos",
    summary:
      "Consulta las fechas de acreditación de los programas pagados por el ministerio.",
    who: "",
    how: "",
    requirements: "",
    notes: "",
    formFields: [],
  },
];

function isNeedId(value: string): value is NeedId {
  return needs.some((item) => item.id === value);
}

function isAreaSlug(value: string) {
  return areas.some((item) => item.slug === value);
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
}): Tramite | null {
  if (!isNeedId(row.need) || !isAreaSlug(row.area_slug)) return null;
  const imageUrl = row.image_url?.trim() ?? "";
  const kind = row.kind === "pagos" ? "pagos" : "form";
  return {
    slug: row.slug,
    title: row.title,
    need: row.need,
    areaSlug: row.area_slug,
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
  const result = areaSlug
    ? await sql`
        SELECT slug, title, need, area_slug, kind, image_url, image_alt,
          summary, who, how, requirements, notes, form_fields
        FROM site_tramites
        WHERE published = true AND area_slug = ${areaSlug}
        ORDER BY sort_order ASC, published_at DESC NULLS LAST, created_at DESC
      `
    : await sql`
        SELECT slug, title, need, area_slug, kind, image_url, image_alt,
          summary, who, how, requirements, notes, form_fields
        FROM site_tramites
        WHERE published = true
        ORDER BY sort_order ASC, published_at DESC NULLS LAST, created_at DESC
      `;

  return rowsOf(result)
    .filter(isTramiteRow)
    .map(mapRow)
    .filter((item): item is Tramite => item !== null);
}

async function tableHasRows(url: string): Promise<boolean> {
  const sql = neon(url);
  const result = await sql`SELECT 1 FROM site_tramites LIMIT 1`;
  return rowsOf(result).length > 0;
}

function devFallback(areaSlug?: string): Tramite[] {
  if (process.env.NODE_ENV !== "development") return [];
  if (!areaSlug) return DEV_FIXTURES;
  return DEV_FIXTURES.filter((item) => item.areaSlug === areaSlug);
}

async function loadPublished(areaSlug?: string): Promise<Tramite[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return devFallback(areaSlug);

  try {
    const items = await queryPublished(url, areaSlug);
    if (items.length > 0) return items;
    if (process.env.NODE_ENV === "development" && !(await tableHasRows(url))) {
      return devFallback(areaSlug);
    }
    return items;
  } catch (error) {
    console.error("No se pudieron leer los trámites de Neon", error);
    return devFallback(areaSlug);
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

function canonicalTramiteSlug(slug: string) {
  return LEGACY_TRAMITE_SLUGS[slug] ?? slug;
}

export async function getPublishedTramite(
  slug: string,
): Promise<Tramite | null> {
  const lookup = canonicalTramiteSlug(slug);
  const url = process.env.DATABASE_URL;
  if (!url) {
    return (
      devFallback().find((item) => item.slug === lookup) ?? null
    );
  }

  try {
    const sql = neon(url);
    const result = await sql`
      SELECT slug, title, need, area_slug, kind, image_url, image_alt,
        summary, who, how, requirements, notes, form_fields
      FROM site_tramites
      WHERE published = true AND slug = ${lookup}
      LIMIT 1
    `;
    const item =
      rowsOf(result)
        .filter(isTramiteRow)
        .map(mapRow)
        .find((row): row is Tramite => row !== null) ?? null;
    if (item) return item;
    if (process.env.NODE_ENV === "development" && !(await tableHasRows(url))) {
      return DEV_FIXTURES.find((row) => row.slug === lookup) ?? null;
    }
    return null;
  } catch (error) {
    console.error("No se pudieron leer los trámites de Neon", error);
    return devFallback().find((item) => item.slug === lookup) ?? null;
  }
}
