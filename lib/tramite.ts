import { areas, getArea } from "@/content/areas";
import type { NeedId } from "@/content/needs";
import type { TramiteFormField } from "@/lib/tramite-form";

/** Área ministerial cuando el CMS manda un slug que el sitio no tiene (p. ej. `general`). */
export const FALLBACK_AREA_SLUG = "atencion-sede";
export const FALLBACK_NEED: NeedId = "territorio";

export type TramiteImage = {
  src: string;
  alt: string;
  replaceWith?: string;
};

export type TramiteKind = "form" | "pagos";

export type Tramite = {
  slug: string;
  title: string;
  need: NeedId;
  areaSlug: string;
  kind: TramiteKind;
  image?: TramiteImage;
  summary: string;
  who: string;
  how: string;
  requirements: string;
  notes: string;
  formFields: TramiteFormField[];
};

export function areaOf(tramite: Tramite) {
  return (
    getArea(tramite.areaSlug) ??
    getArea(FALLBACK_AREA_SLUG) ??
    areas[0]
  );
}
