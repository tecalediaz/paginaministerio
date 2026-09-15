import { areas } from "@/content/areas";
import type { NeedId } from "@/content/needs";
import { site } from "@/content/site";

export type Tramite = {
  slug: string;
  title: string;
  need: NeedId;
  areaSlug: string;
  featured: boolean;
  summary: string;
  who: string;
  requirements: string[];
  where: string;
  when: string;
  contact: string;
};

const sede = `${site.contact.address}, ${site.contact.city}`;
const consultar = "Consultar en sede los requisitos y documentación vigentes.";

export const tramites: Tramite[] = [
  {
    slug: "atenderse-en-sede",
    title: "Atenderse en la sede central",
    need: "territorio",
    areaSlug: "atencion-sede",
    featured: true,
    summary:
      "Acercate a la mesa de entrada para que te orienten al área o programa que corresponde.",
    who: "Cualquier persona que necesite información o iniciar una consulta.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: `${site.contact.phone} · ${site.contact.email}`,
  },
  {
    slug: "consultar-por-whatsapp",
    title: "Consultar por WhatsApp o teléfono",
    need: "territorio",
    areaSlug: "atencion-sede",
    featured: true,
    summary: "Escribí o llamá para saber cómo seguir con un trámite o una consulta.",
    who: "Quienes no pueden acercarse en el horario de atención o necesitan una primera orientación.",
    requirements: ["Tener a mano el motivo de la consulta. No reemplaza un trámite presencial si el área lo requiere."],
    where: "Teléfono y WhatsApp del ministerio.",
    when: site.contact.hours,
    contact: `${site.contact.phone} · WhatsApp disponible en Contacto`,
  },
  {
    slug: "asistencia-alimentaria",
    title: "Consultar asistencia alimentaria",
    need: "alimentacion",
    areaSlug: "seguridad-alimentaria",
    featured: true,
    summary: "Orientación sobre dispositivos de seguridad alimentaria del ministerio.",
    who: "Familias que necesitan información sobre asistencia alimentaria.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "ninez-y-familias",
    title: "Consultar niñez, adolescencia y familia",
    need: "infancias",
    areaSlug: "ninez",
    featured: true,
    summary: "Orientación sobre políticas de cuidado y protección de niñeces y familias.",
    who: "Familias, adolescentes y personas que acompañan a niños y niñas.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "primera-infancia",
    title: "Consultar primera infancia",
    need: "infancias",
    areaSlug: "primera-infancia",
    featured: false,
    summary: "Información sobre espacios y programas de primera infancia.",
    who: "Familias con niñas y niños pequeños.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "discapacidad-orientacion",
    title: "Consultar discapacidad e inclusión",
    need: "discapacidad",
    areaSlug: "discapacidad",
    featured: true,
    summary: "Orientación del Consejo Provincial para Personas con Discapacidad.",
    who: "Personas con discapacidad, familias y organizaciones.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "deporte-e-inclusion",
    title: "Consultar deporte, recreación e inclusión",
    need: "deporte",
    areaSlug: "deportes",
    featured: true,
    summary: "Información sobre actividades deportivas, recreativas e inclusivas.",
    who: "Quienes buscan colonias, deporte adaptado u otras propuestas del área.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "economia-popular",
    title: "Consultar economía popular",
    need: "trabajo",
    areaSlug: "economia-popular",
    featured: true,
    summary:
      "Orientación para trabajadoras y trabajadores de la economía popular y social.",
    who: "Personas y unidades productivas de la economía popular.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "inclusion-y-desarrollo",
    title: "Consultar inclusión y desarrollo",
    need: "territorio",
    areaSlug: "inclusion-desarrollo",
    featured: false,
    summary: "Orientación sobre programas de inclusión social y desarrollo.",
    who: "Personas y familias que necesitan saber qué programas puede ofrecer el área.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "desarrollo-territorial",
    title: "Consultar desarrollo territorial",
    need: "territorio",
    areaSlug: "desarrollo-territorial",
    featured: false,
    summary: "Canal para consultas de llegada territorial y articulación con municipios.",
    who: "Vecinas, vecinos y equipos municipales.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "consejo-desarrollo-social",
    title: "Consultar el Consejo Provincial de Desarrollo Social",
    need: "territorio",
    areaSlug: "coprodeso",
    featured: false,
    summary: "Información sobre el consejo consultivo con representación municipal.",
    who: "Consejeras, consejeros y gobiernos locales.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
  {
    slug: "proyectos-especiales",
    title: "Consultar proyectos especiales",
    need: "trabajo",
    areaSlug: "proyectos-especiales",
    featured: false,
    summary: "Consultá en sede qué proyectos o convocatorias están vigentes.",
    who: "Personas y organizaciones interesadas en proyectos del ministerio.",
    requirements: [consultar],
    where: sede,
    when: site.contact.hours,
    contact: site.contact.phone,
  },
];

export function getTramite(slug: string) {
  return tramites.find((item) => item.slug === slug);
}

export function tramitesByArea(areaSlug: string) {
  return tramites.filter((item) => item.areaSlug === areaSlug);
}

export function tramitesByNeed(need: NeedId) {
  return tramites.filter((item) => item.need === need);
}

export function featuredTramites() {
  return tramites.filter((item) => item.featured);
}

export function areaOf(tramite: Tramite) {
  const area = areas.find((item) => item.slug === tramite.areaSlug);
  if (!area) {
    throw new Error(`Area missing for tramite ${tramite.slug}`);
  }
  return area;
}
