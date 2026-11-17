import { areaMapUrls } from "@/lib/area-map";

export const AREA_KINDS = [
  "Secretaría",
  "Subsecretaría",
  "Dirección general",
  "Consejo",
  "Coordinación",
  "Mesa de entrada",
] as const;
export type AreaKind = (typeof AREA_KINDS)[number];

export const AREA_NEEDS = [
  "educacion",
  "alimentacion",
  "infancias",
  "discapacidad",
  "deporte",
  "trabajo",
  "territorio",
] as const;
export type AreaNeed = (typeof AREA_NEEDS)[number];

export const AREA_NEED_LABEL: Record<AreaNeed, string> = {
  educacion: "Educación",
  alimentacion: "Alimentación",
  infancias: "Infancias",
  discapacidad: "Discapacidad",
  deporte: "Deporte",
  trabajo: "Trabajo",
  territorio: "Territorio",
};

export type PublicSocialLink = {
  id: "instagram" | "facebook" | "x" | "tiktok";
  label: string;
  href: string;
};
export type PublicSedeView = {
  name: string;
  address: string;
  hours: string;
  mapEmbed: string | null;
  mapOpen: string | null;
};
export type PublicAreaView = {
  slug: string;
  name: string;
  kind: AreaKind;
  need: AreaNeed;
  needLabel: string;
  summary: string | null;
  coverUrl: string | null;
  sedes: PublicSedeView[];
  social: PublicSocialLink[];
};

const SOCIAL_PLATFORMS = {
  INSTAGRAM: { id: "instagram" as const, label: "Instagram" },
  FACEBOOK: { id: "facebook" as const, label: "Facebook" },
  X: { id: "x" as const, label: "X" },
  TIKTOK: { id: "tiktok" as const, label: "TikTok" },
};

const STORED_AREA_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const FALLBACK_SUBMISSION_SLUG = "atencion-sede";

export function toDirectoryArea(area: PublicAreaView) {
  return {
    slug: area.slug,
    name: area.name,
    kind: area.kind,
    need: area.need,
    summary: area.summary,
  };
}

export function resolveSubmissionArea(slug: string, known: ReadonlySet<string>): string | null {
  if (slug === "general") return known.has(FALLBACK_SUBMISSION_SLUG) ? FALLBACK_SUBMISSION_SLUG : null;
  if (!STORED_AREA_SLUG.test(slug) || !known.has(slug)) return null;
  return slug;
}

export function toPublicAreaView(
  area: {
    slug: string;
    name: string;
    kind: AreaKind;
    need: AreaNeed;
    summary: string;
    coverUrl: string | null;
  },
  sedes: {
    name: string;
    address: string;
    hours: string;
    latitude: number | null;
    longitude: number | null;
    sortOrder: number;
  }[],
  networks: { platform: string; profileUrl?: string | null }[],
): PublicAreaView {
  const summary = area.summary.trim();
  const publicSedes = [...sedes]
    .filter((sede) => sede.address.trim().length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((sede) => {
      const latitude = sede.latitude;
      const longitude = sede.longitude;
      const maps =
        latitude !== null && longitude !== null && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? areaMapUrls(latitude, longitude)
          : null;
      return {
        name: sede.name.trim(),
        address: sede.address.trim(),
        hours: sede.hours.trim(),
        mapEmbed: maps?.embed ?? null,
        mapOpen: maps?.open ?? null,
      };
    });

  const social: PublicSocialLink[] = [];
  for (const network of networks) {
    const platform = SOCIAL_PLATFORMS[network.platform as keyof typeof SOCIAL_PLATFORMS];
    if (!platform) continue;
    const href = (network.profileUrl ?? "").trim();
    if (!href.startsWith("https://")) continue;
    social.push({ id: platform.id, label: platform.label, href });
  }

  return {
    slug: area.slug,
    name: area.name,
    kind: area.kind,
    need: area.need,
    needLabel: AREA_NEED_LABEL[area.need],
    summary: summary ? summary : null,
    coverUrl: area.coverUrl,
    sedes: publicSedes,
    social,
  };
}
