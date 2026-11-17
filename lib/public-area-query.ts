import "server-only";
import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { sqlFor, type Sql } from "@/lib/sql";
import {
  AREA_KINDS,
  AREA_NEEDS,
  toPublicAreaView,
  type AreaKind,
  type AreaNeed,
  type PublicAreaView,
} from "@/lib/public-area";

type AreaQueryRow = {
  slug: string;
  name: string;
  kind: string;
  need: string;
  summary: string | null;
  cover_url: string | null;
  sede_name: string | null;
  sede_address: string | null;
  sede_hours: string | null;
  sede_latitude: number | string | null;
  sede_longitude: number | string | null;
  sede_sort_order: number | null;
  structured_doc: unknown;
};

function isAreaKind(value: string): value is AreaKind {
  return (AREA_KINDS as readonly string[]).includes(value);
}

function isAreaNeed(value: string): value is AreaNeed {
  return (AREA_NEEDS as readonly string[]).includes(value);
}

function coordinate(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function publicCoverUrl(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function networksFromDoc(raw: unknown): { platform: string; profileUrl: string | null }[] {
  let doc = raw;
  if (typeof doc === "string") {
    try {
      doc = JSON.parse(doc);
    } catch {
      return [];
    }
  }
  if (!doc || typeof doc !== "object") return [];
  const socialNetworks = (doc as { socialNetworks?: unknown }).socialNetworks;
  if (!Array.isArray(socialNetworks)) return [];
  const networks: { platform: string; profileUrl: string | null }[] = [];
  for (const item of socialNetworks) {
    if (!item || typeof item !== "object") continue;
    const platform = (item as { platform?: unknown }).platform;
    const profileUrl = (item as { profileUrl?: unknown }).profileUrl;
    if (typeof platform !== "string") continue;
    networks.push({
      platform,
      profileUrl: typeof profileUrl === "string" ? profileUrl : null,
    });
  }
  return networks;
}

async function queryPublicAreas(sql: Sql): Promise<PublicAreaView[]> {
  const rows = await sql<AreaQueryRow[]>`
    SELECT
      a.slug,
      a.name,
      a.kind,
      a.need,
      a.summary,
      a.cover_url,
      s.name AS sede_name,
      s.address AS sede_address,
      s.hours AS sede_hours,
      s.latitude AS sede_latitude,
      s.longitude AS sede_longitude,
      s.sort_order AS sede_sort_order,
      d.structured_doc
    FROM site_areas a
    LEFT JOIN site_area_sedes s ON s.area_id = a.id
    LEFT JOIN social_account_docs d ON d.id = a.account_id
    ORDER BY a.created_at ASC, a.slug ASC, s.sort_order ASC NULLS LAST
  `;

  const order: string[] = [];
  const grouped = new Map<
    string,
    {
      area: {
        slug: string;
        name: string;
        kind: AreaKind;
        need: AreaNeed;
        summary: string;
        coverUrl: string | null;
      };
      sedes: {
        name: string;
        address: string;
        hours: string;
        latitude: number | null;
        longitude: number | null;
        sortOrder: number;
      }[];
      networks: { platform: string; profileUrl: string | null }[];
    }
  >();

  for (const row of rows) {
    if (typeof row.slug !== "string" || typeof row.name !== "string") continue;
    if (!isAreaKind(row.kind) || !isAreaNeed(row.need)) continue;
    let entry = grouped.get(row.slug);
    if (!entry) {
      entry = {
        area: {
          slug: row.slug,
          name: row.name,
          kind: row.kind,
          need: row.need,
          summary: row.summary ?? "",
          coverUrl: publicCoverUrl(row.cover_url),
        },
        sedes: [],
        networks: networksFromDoc(row.structured_doc),
      };
      grouped.set(row.slug, entry);
      order.push(row.slug);
    }
    if (typeof row.sede_address === "string") {
      entry.sedes.push({
        name: row.sede_name ?? "",
        address: row.sede_address,
        hours: row.sede_hours ?? "",
        latitude: coordinate(row.sede_latitude),
        longitude: coordinate(row.sede_longitude),
        sortOrder: typeof row.sede_sort_order === "number" ? row.sede_sort_order : entry.sedes.length + 1,
      });
    }
  }

  return order.flatMap((slug) => {
    const entry = grouped.get(slug);
    return entry ? [toPublicAreaView(entry.area, entry.sedes, entry.networks)] : [];
  });
}

const readPublicAreas = cache(async (): Promise<PublicAreaView[]> => {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    return await queryPublicAreas(sqlFor(url));
  } catch {
    return [];
  }
});

export async function listPublicAreas(): Promise<PublicAreaView[]> {
  noStore();
  return readPublicAreas();
}

export async function getPublicArea(slug: string): Promise<PublicAreaView | null> {
  noStore();
  const areas = await listPublicAreas();
  return areas.find((area) => area.slug === slug) ?? null;
}
