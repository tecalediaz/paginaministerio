import type { NeedId } from "@/content/needs";
import type { SocialId } from "@/content/site";

export type AreaSocial = Partial<Record<SocialId, string>>;

export type Area = {
  slug: string;
  name: string;
  kind: string;
  need: NeedId;
  summary: string;
  audience: string;
  access: string;
  social?: AreaSocial;
};

export const KIND_ORDER = [
  "Secretaría",
  "Subsecretaría",
  "Dirección general",
  "Consejo",
  "Coordinación",
  "Mesa de entrada",
] as const;
