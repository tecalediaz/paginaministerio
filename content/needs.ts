export const needs = [
  {
    id: "alimentacion",
    label: "Alimentación",
    hint: "Comedores, asistencia alimentaria y consultas del área.",
  },
  {
    id: "infancias",
    label: "Infancias",
    hint: "Niñez, adolescencia, familia y primera infancia.",
  },
  {
    id: "discapacidad",
    label: "Discapacidad",
    hint: "Consejo provincial, inclusión y orientación.",
  },
  {
    id: "deporte",
    label: "Deporte",
    hint: "Deporte, recreación e inclusión.",
  },
  {
    id: "trabajo",
    label: "Trabajo",
    hint: "Economía popular y proyectos productivos.",
  },
  {
    id: "territorio",
    label: "Territorio",
    hint: "Desarrollo territorial, inclusión y consejos locales.",
  },
] as const;

export type NeedId = (typeof needs)[number]["id"];

export function getNeed(id: NeedId) {
  const need = needs.find((item) => item.id === id);
  if (!need) {
    throw new Error(`Need not found: ${id}`);
  }
  return need;
}
