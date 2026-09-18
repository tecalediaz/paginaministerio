import { areas } from "@/content/areas";
import type { NeedId } from "@/content/needs";
import type { TramiteFormField } from "@/lib/tramite-form";

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
  const area = areas.find((item) => item.slug === tramite.areaSlug);
  if (!area) {
    throw new Error(`Area missing for tramite ${tramite.slug}`);
  }
  return area;
}
