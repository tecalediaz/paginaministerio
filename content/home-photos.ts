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
