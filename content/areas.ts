import type { NeedId } from "@/content/needs";

export type Area = {
  slug: string;
  name: string;
  kind: string;
  need: NeedId;
  summary: string;
  audience: string;
  access: string;
};

export const areas: Area[] = [
  {
    slug: "deportes",
    name: "Secretaría de Deportes, Recreación e Inclusión",
    kind: "Secretaría",
    need: "deporte",
    summary:
      "Promueve el deporte, la recreación y la inclusión en los departamentos de la provincia.",
    audience:
      "Niños, jóvenes, adultos y personas con discapacidad que buscan actividades deportivas o recreativas.",
    access: "Consultar en sede o por los canales de contacto del ministerio.",
  },
  {
    slug: "discapacidad",
    name: "Consejo Provincial para Personas con Discapacidad",
    kind: "Consejo",
    need: "discapacidad",
    summary:
      "Orienta políticas de inclusión y atención a personas con discapacidad.",
    audience: "Personas con discapacidad, familias y organizaciones que las acompañan.",
    access: "Consultar en sede los programas y turnos vigentes.",
  },
  {
    slug: "economia-popular",
    name: "Secretaría de Economía Social y Popular",
    kind: "Secretaría",
    need: "trabajo",
    summary:
      "Acompaña a trabajadoras y trabajadores de la economía popular y la economía social.",
    audience: "Quienes trabajan en oficios, cooperativas, ferias y unidades productivas populares.",
    access: "Consultar en sede la inscripción y los programas abiertos.",
  },
  {
    slug: "inclusion-desarrollo",
    name: "Secretaría de Inclusión y Desarrollo",
    kind: "Secretaría",
    need: "territorio",
    summary:
      "Trabaja políticas de inclusión social y desarrollo de las familias riojanas.",
    audience: "Personas y familias que necesitan orientación sobre programas sociales.",
    access: "Consultar en sede qué trámites están abiertos.",
  },
  {
    slug: "desarrollo-territorial",
    name: "Secretaría de Desarrollo Territorial para la Inclusión Social",
    kind: "Secretaría",
    need: "territorio",
    summary:
      "Articula el trabajo del ministerio con municipios y territorios de la provincia.",
    audience: "Vecinas, vecinos y gobiernos locales que necesitan llegada territorial.",
    access: "Consultar en sede o a través del Consejo Provincial de Desarrollo Social.",
  },
  {
    slug: "ninez",
    name: "Subsecretaría de Niñez, Adolescencia y Familia",
    kind: "Subsecretaría",
    need: "infancias",
    summary:
      "Impulsa políticas de cuidado, protección y acompañamiento de niñeces, adolescencias y familias.",
    audience: "Niños, niñas, adolescentes y sus familias.",
    access: "Consultar en sede. Para una urgencia, usar teléfono o WhatsApp del ministerio.",
  },
  {
    slug: "seguridad-alimentaria",
    name: "Subsecretaría de Seguridad Alimentaria",
    kind: "Subsecretaría",
    need: "alimentacion",
    summary:
      "Coordina las políticas de asistencia y seguridad alimentaria de la provincia.",
    audience: "Familias que necesitan orientación sobre asistencia alimentaria.",
    access: "Consultar en sede los dispositivos y requisitos vigentes.",
  },
  {
    slug: "primera-infancia",
    name: "Dirección General de Primera Infancia",
    kind: "Dirección general",
    need: "infancias",
    summary:
      "Acompaña políticas y espacios de cuidado para la primera infancia.",
    audience: "Familias con niñas y niños pequeños.",
    access: "Consultar en sede los espacios y programas disponibles.",
  },
  {
    slug: "innovacion-publica",
    name: "Dirección General de Innovación Pública",
    kind: "Dirección general",
    need: "territorio",
    summary:
      "Apoya la modernización y los proyectos de innovación del ministerio.",
    audience: "Equipos de gobierno y organizaciones que articulan con el ministerio.",
    access: "Consultar en sede.",
  },
  {
    slug: "coprodeso",
    name: "Consejo Provincial de Desarrollo Social",
    kind: "Consejo",
    need: "territorio",
    summary:
      "Espacio consultivo con representación de los municipios para las políticas sociales provinciales.",
    audience: "Consejeras, consejeros y gobiernos locales de los departamentos.",
    access: "Consultar en sede las sesiones y canales de participación.",
  },
  {
    slug: "proyectos-especiales",
    name: "Dirección General de Proyectos Especiales",
    kind: "Dirección general",
    need: "trabajo",
    summary:
      "Gestiona proyectos especiales del ministerio. Los programas abiertos se informan en sede.",
    audience: "Personas y organizaciones vinculadas a proyectos productivos o sociales en curso.",
    access: "Consultar en sede qué convocatorias están vigentes.",
  },
  {
    slug: "atencion-sede",
    name: "Atención en sede",
    kind: "Mesa de entrada",
    need: "territorio",
    summary:
      "Orientación presencial en la sede central para saber a qué área o trámite corresponde cada consulta.",
    audience: "Cualquier persona que necesite acercarse al ministerio.",
    access:
      "Av. Alem y Av. Los Caudillos, Ciudad de La Rioja. Lunes a viernes, 8:00–13:00 y 17:00–21:00.",
  },
];

export function getArea(slug: string) {
  return areas.find((area) => area.slug === slug);
}

export function areasByNeed(need: NeedId) {
  return areas.filter((area) => area.need === need);
}
