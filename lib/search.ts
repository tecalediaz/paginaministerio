import { areas, type Area } from "@/content/areas";
import type { NeedId } from "@/content/needs";
import { tramites, type Tramite } from "@/content/tramites";

function haystack(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchCatalog(query: string, need?: NeedId | "todas") {
  const q = haystack(query.trim());
  const matchNeed = (item: { need: NeedId }) =>
    !need || need === "todas" || item.need === need;

  const areaHits: Area[] = areas.filter((area) => {
    if (!matchNeed(area)) return false;
    if (!q) return true;
    return haystack(
      `${area.name} ${area.kind} ${area.summary} ${area.audience}`,
    ).includes(q);
  });

  const tramiteHits: Tramite[] = tramites.filter((tramite) => {
    if (!matchNeed(tramite)) return false;
    if (!q) return true;
    return haystack(
      `${tramite.title} ${tramite.summary} ${tramite.who}`,
    ).includes(q);
  });

  return { areas: areaHits, tramites: tramiteHits };
}
