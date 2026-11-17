import { getNeed, type NeedId } from "@/content/needs";
import type { Tramite } from "@/lib/tramite";

export type SearchArea = {
  slug: string;
  name: string;
  kind: string;
  need: NeedId;
  summary: string | null;
};

function haystack(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchCatalog(
  query: string,
  tramites: Tramite[] = [],
  need?: NeedId | "todas",
  areas: readonly SearchArea[] = [],
) {
  const q = haystack(query.trim());
  const matchNeed = (item: { need: NeedId }) =>
    !need || need === "todas" || item.need === need;

  const areaHits = areas.filter((area) => {
    if (!matchNeed(area)) return false;
    if (!q) return true;
    return haystack(
      `${area.name} ${area.kind} ${area.summary ?? ""} ${area.need} ${getNeed(area.need).label}`,
    ).includes(q);
  });

  const tramiteHits: Tramite[] = tramites.filter((tramite) => {
    if (!matchNeed(tramite)) return false;
    if (!q) return true;
    return haystack(
      `${tramite.title} ${tramite.summary} ${tramite.who} ${tramite.how} ${tramite.notes} ${tramite.slug} ${tramite.kind} ${tramite.image?.alt ?? ""}`,
    ).includes(q);
  });

  return { areas: areaHits, tramites: tramiteHits };
}
