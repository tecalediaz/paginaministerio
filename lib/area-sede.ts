import "server-only";
import { areaMapUrls } from "@/lib/area-map";
import { sqlFor } from "@/lib/sql";

export type AreaSede = {
  address: string;
  hours: string;
  mapEmbed: string | null;
  mapOpen: string | null;
};

const emptySede: AreaSede = { address: "", hours: "", mapEmbed: null, mapOpen: null };

function coordinate(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export async function getAreaSede(areaSlug: string): Promise<AreaSede> {
  const url = process.env.DATABASE_URL;
  if (!url) return emptySede;

  try {
    const rows = await sqlFor(url)<
      { address: string; hours: string; latitude: number | string | null; longitude: number | string | null }[]
    >`
      SELECT address, hours, latitude, longitude
      FROM site_area_content
      WHERE area_slug = ${areaSlug}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return emptySede;

    const latitude = coordinate(row.latitude);
    const longitude = coordinate(row.longitude);
    const map = latitude !== null && longitude !== null ? areaMapUrls(latitude, longitude) : null;

    return {
      address: row.address.trim(),
      hours: row.hours.trim(),
      mapEmbed: map?.embed ?? null,
      mapOpen: map?.open ?? null,
    };
  } catch (error) {
    console.error("No se pudo leer la sede del área", error);
    return emptySede;
  }
}
