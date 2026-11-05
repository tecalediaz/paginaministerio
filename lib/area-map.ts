export type AreaMapUrls = { embed: string; open: string };

export function areaMapUrls(latitude: number, longitude: number): AreaMapUrls | null {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const embed = new URL("https://www.openstreetmap.org/export/embed.html");
  embed.searchParams.set(
    "bbox",
    [
      Math.max(-180, longitude - 0.008),
      Math.max(-90, latitude - 0.005),
      Math.min(180, longitude + 0.008),
      Math.min(90, latitude + 0.005),
    ].join(","),
  );
  embed.searchParams.set("layer", "mapnik");
  embed.searchParams.set("marker", `${latitude},${longitude}`);

  const open = new URL("https://www.google.com/maps/search/");
  open.searchParams.set("api", "1");
  open.searchParams.set("query", `${latitude},${longitude}`);

  return { embed: embed.href, open: open.href };
}
