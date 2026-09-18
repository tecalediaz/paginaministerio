import { neon } from "@neondatabase/serverless";

export type Gestion = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string;
  imageAlt: string;
  href: string | null;
};

const HOME_LIMIT = 5;

const DEV_FIXTURES: Gestion[] = [
  {
    id: "dev-gestion-1",
    title: "Publicación de gestión",
    summary: "Imagen y texto de ejemplo. En producción solo se ven gestiones publicadas.",
    imageUrl: "/placeholders/territorio.jpg",
    imageAlt: "Imagen provisoria de gestión en territorio.",
    href: null,
  },
  {
    id: "dev-gestion-2",
    title: "Otra publicación",
    summary: "Hasta cinco publicaciones rotan en el banner, una a la vez.",
    imageUrl: "/placeholders/infancias.jpg",
    imageAlt: "Imagen provisoria de infancias.",
    href: null,
  },
  {
    id: "dev-gestion-3",
    title: "Tercera publicación",
    summary: "Cada pieza muestra imagen, título y una descripción breve.",
    imageUrl: "/placeholders/deporte.jpg",
    imageAlt: "Imagen provisoria de deporte.",
    href: null,
  },
];

function isGestionRow(row: Record<string, unknown>): row is {
  id: string;
  title: string;
  summary: string | null;
  image_url: string;
  image_alt: string | null;
  href: string | null;
} {
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.image_url === "string"
  );
}

function mapRow(row: {
  id: string;
  title: string;
  summary: string | null;
  image_url: string;
  image_alt: string | null;
  href: string | null;
}): Gestion {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? "",
    href: row.href,
  };
}

function rowsOf(result: unknown): Record<string, unknown>[] {
  if (!Array.isArray(result)) return [];
  return result.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null && !Array.isArray(row),
  );
}

async function queryPublishedGestiones(
  sql: ReturnType<typeof neon>,
  areaSlug?: string,
) {
  if (areaSlug) {
    const result = await sql`
      SELECT id, title, summary, image_url, image_alt, href
      FROM site_gestiones
      WHERE published = true AND area_slug = ${areaSlug}
      ORDER BY sort_order ASC, published_at DESC NULLS LAST, created_at DESC
      LIMIT ${HOME_LIMIT}
    `;
    return rowsOf(result).filter(isGestionRow).map(mapRow);
  }

  const result = await sql`
    SELECT id, title, summary, image_url, image_alt, href
    FROM site_gestiones
    WHERE published = true AND area_slug IS NULL
    ORDER BY sort_order ASC, published_at DESC NULLS LAST, created_at DESC
    LIMIT ${HOME_LIMIT}
  `;
  return rowsOf(result).filter(isGestionRow).map(mapRow);
}

export async function listPublishedGestiones(): Promise<Gestion[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return process.env.NODE_ENV === "development" ? DEV_FIXTURES : [];
  }

  try {
    const items = await queryPublishedGestiones(neon(url));
    if (items.length === 0 && process.env.NODE_ENV === "development") {
      return DEV_FIXTURES;
    }
    return items;
  } catch (error) {
    console.error("No se pudieron leer las gestiones de Neon", error);
    return process.env.NODE_ENV === "development" ? DEV_FIXTURES : [];
  }
}

export async function listPublishedGestionesByArea(
  areaSlug: string,
): Promise<Gestion[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    return await queryPublishedGestiones(neon(url), areaSlug);
  } catch (error) {
    console.error("No se pudieron leer las gestiones del área", error);
    return [];
  }
}
