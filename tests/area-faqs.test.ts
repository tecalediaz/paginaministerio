import assert from "node:assert/strict";
import test from "node:test";
import { publishedAreaFaqs } from "../lib/area-faqs";

const visible = {
  id: "f76bf48e-97c4-41bb-8e7b-d93c03a846d6",
  question: " ¿Cómo se realiza la inscripción? ",
  answer: "Contenido\nsegunda línea",
  published: true,
};
const hidden = {
  id: "bf1b29a6-228b-4f01-948f-7491d64e7c5d",
  question: "Pregunta oculta",
  answer: "Respuesta oculta",
  published: false,
};

test("visible area faqs keep order and drop hidden or malformed rows", () => {
  const faqs = publishedAreaFaqs([
    hidden,
    visible,
    { ...visible, id: "no-es-uuid" },
    { ...visible, question: "   " },
    { ...visible, published: "true" },
    {
      id: "11111111-1111-4111-8111-111111111111",
      question: "Segunda",
      answer: "<b>texto</b>",
      published: true,
    },
  ]);

  assert.deepEqual(
    faqs.map((item) => item.question),
    ["¿Cómo se realiza la inscripción?", "Segunda"],
  );
  assert.equal(faqs[0]?.answer, "Contenido\nsegunda línea");
  assert.equal(faqs[1]?.answer, "<b>texto</b>");
});

test("visible area faqs read a json string and stop at 30", () => {
  const rows = Array.from({ length: 31 }, (_, index) => ({
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    question: `Pregunta ${index}`,
    answer: "Respuesta",
    published: true,
  }));

  const faqs = publishedAreaFaqs(JSON.stringify(rows));
  assert.equal(faqs.length, 30);
  assert.equal(faqs[0]?.question, "Pregunta 0");
  assert.equal(publishedAreaFaqs("no-json").length, 0);
  assert.equal(publishedAreaFaqs({ faqs: [visible] }).length, 0);
});
