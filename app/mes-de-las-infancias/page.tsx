import type { Metadata } from "next";
import { FestipequesLanding } from "@/components/infancias/FestipequesLanding";

export const metadata: Metadata = {
  title: "Festi Peques — Mes de las Infancias",
  description:
    "Mes de las Infancias 2026 en La Rioja. Programa Fortalecimiento Escolar y Social (F.E.S.): 2.038 niñas, niños y adolescentes en 119 centros de toda la provincia.",
  openGraph: {
    title: "Festi Peques | Mes de las Infancias — La Rioja",
    description:
      "El Estado presente en cada aula. Campaña Festi Peques y Programa F.E.S. del Ministerio de Desarrollo, Igualdad e Integración Social.",
  },
};

export default function MesDeLasInfanciasPage() {
  return <FestipequesLanding />;
}
