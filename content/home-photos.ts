import type { Area } from "@/content/areas";
import type { NeedId } from "@/content/needs";

export type HomePhoto = {
  src: string;
  alt: string;
  replaceWith: string;
};

export const ministerPhoto: HomePhoto = {
  src: "/placeholders/ministro.jpg",
  alt: "Imagen provisoria. Reemplazar por el retrato oficial del ministro.",
  replaceWith:
    "Retrato oficial del ministro Alfredo Menem: foto institucional, traje, fondo de sede o neutro.",
};

export const needPhotos: Record<NeedId, HomePhoto> = {
  alimentacion: {
    src: "/placeholders/alimentacion.jpg",
    alt: "Imagen provisoria de asistencia alimentaria.",
    replaceWith:
      "Gestión alimentaria: comedor, entrega o dispositivo de Seguridad Alimentaria en La Rioja.",
  },
  infancias: {
    src: "/placeholders/infancias.jpg",
    alt: "Imagen provisoria de infancias.",
    replaceWith:
      "Actividad de niñez, adolescencia o primera infancia del ministerio (no stock genérico).",
  },
  discapacidad: {
    src: "/placeholders/discapacidad.jpg",
    alt: "Imagen provisoria de inclusión.",
    replaceWith:
      "Gestión del Consejo Provincial para Personas con Discapacidad: atención, deporte adaptado o inclusión.",
  },
  deporte: {
    src: "/placeholders/deporte.jpg",
    alt: "Imagen provisoria de deporte.",
    replaceWith:
      "Actividad de Deportes, Recreación e Inclusión en la provincia (colonia, entrenamiento o evento).",
  },
  trabajo: {
    src: "/placeholders/trabajo.jpg",
    alt: "Imagen provisoria de trabajo.",
    replaceWith:
      "Economía popular o proyecto productivo del área: taller, unidad productiva o capacitación.",
  },
  territorio: {
    src: "/placeholders/territorio.jpg",
    alt: "Imagen provisoria de territorio.",
    replaceWith:
      "Desarrollo territorial: trabajo en el interior, consejo local o hábitat / techo.",
  },
};

export const sedePhoto: HomePhoto = {
  src: "/placeholders/sede.jpg",
  alt: "Imagen provisoria de la sede.",
  replaceWith:
    "Fachada de la sede central, Av. Alem y Av. Los Caudillos, Ciudad de La Rioja.",
};

export function photoForArea(area: Area): HomePhoto {
  if (area.slug === "atencion-sede") return sedePhoto;
  const photo = needPhotos[area.need];
  return {
    ...photo,
    replaceWith: `Foto oficial de ${area.name}: gestión en territorio o sede (no stock genérico).`,
  };
}
