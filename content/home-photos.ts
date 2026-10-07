import type { Area } from "@/content/areas";
import type { NeedId } from "@/content/needs";

export type HomePhoto = {
  src: string;
  alt: string;
  replaceWith?: string;
  objectPosition?: string;
};

export const ministerPhoto: HomePhoto = {
  src: "/placeholders/ministro.jpg",
  alt: "Imagen provisoria. Reemplazar por el retrato oficial del ministro.",
  replaceWith:
    "Retrato oficial del ministro Alfredo Menem: foto institucional, traje, fondo de sede o neutro.",
};

export const needPhotos: Record<NeedId, HomePhoto> = {
  educacion: {
    src: "/home/necesidades/educacion.webp",
    alt: "Niñas y niños dibujando con lápices de colores.",
  },
  alimentacion: {
    src: "/home/necesidades/alimentacion.webp",
    alt: "Niñas compartiendo una merienda en una mesa.",
  },
  infancias: {
    src: "/home/necesidades/infancias.webp",
    alt: "Un niño participando en una actividad de pintura.",
  },
  discapacidad: {
    src: "/home/necesidades/discapacidad.webp",
    alt: "Dos niños jugando al básquet, uno de ellos en silla de ruedas.",
    objectPosition: "75% center",
  },
  deporte: {
    src: "/home/necesidades/deporte.webp",
    alt: "Dos jóvenes disputando una pelota en un partido de fútbol.",
  },
  trabajo: {
    src: "/home/necesidades/trabajo.webp",
    alt: "Un trabajador preparando productos en un puesto de feria.",
  },
  territorio: {
    src: "/home/necesidades/territorio.webp",
    alt: "El ministro Alfredo Menem conversando con vecinas en una feria.",
  },
};

export const sedePhoto: HomePhoto = {
  src: "/home/ministerio.webp",
  alt: "Fachada de la sede central del Ministerio de Desarrollo, Igualdad e Integración Social en la Ciudad de La Rioja.",
};

export const areaPhotos: Record<string, HomePhoto> = {
  deportes: {
    src: "/areas/deportes.webp",
    alt: "Una instructora acompañando a un niño con casco y protección durante una actividad deportiva.",
    objectPosition: "70% center",
  },
  discapacidad: {
    src: "/areas/discapacidad.webp",
    alt: "Dos niños jugando al básquet, uno de ellos en silla de ruedas.",
    objectPosition: "70% center",
  },
  "economia-popular": {
    src: "/areas/economia-popular.webp",
    alt: "Un trabajador atendiendo su puesto de productos en una feria.",
    objectPosition: "73% center",
  },
  "inclusion-desarrollo": {
    src: "/areas/inclusion-desarrollo.webp",
    alt: "Un niño participando en una actividad de pintura.",
    objectPosition: "38% center",
  },
  "desarrollo-territorial": {
    src: "/areas/desarrollo-territorial.webp",
    alt: "El ministro Alfredo Menem conversando con vecinas en una feria.",
    objectPosition: "40% center",
  },
  ninez: {
    src: "/areas/ninez.webp",
    alt: "Una niña pintando en un atril durante una actividad acompañada por personas adultas.",
    objectPosition: "25% center",
  },
  "seguridad-alimentaria": {
    src: "/areas/seguridad-alimentaria.webp",
    alt: "Niñas y niños compartiendo una merienda en una mesa.",
    objectPosition: "55% center",
  },
  "primera-infancia": {
    src: "/areas/primera-infancia.webp",
    alt: "Un niño sonriendo durante una actividad al aire libre.",
    objectPosition: "18% center",
  },
  fes: {
    src: "/areas/fes.webp",
    alt: "Una niña escribiendo en su cuaderno junto a sus compañeros.",
    objectPosition: "65% center",
  },
};

export function photoForArea(area: Area): HomePhoto {
  if (area.slug === "atencion-sede") return sedePhoto;
  if (areaPhotos[area.slug]) return areaPhotos[area.slug];
  const photo = needPhotos[area.need];
  if (!photo.replaceWith) return photo;
  return {
    ...photo,
    replaceWith: `Foto oficial de ${area.name}: gestión en territorio o sede (no stock genérico).`,
  };
}
