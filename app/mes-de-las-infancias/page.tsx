import type { Metadata } from "next";
import { FestipequesLanding } from "@/components/infancias/FestipequesLanding";

export const metadata: Metadata = {
  title: "Festi Peques — Mes de las Infancias",
  description:
    "Mes de las Infancias 2026 en La Rioja. Recursos del Ministerio de Desarrollo, Igualdad e Integración Social para las infancias: Festi Peques, F.E.S., primera infancia, alimentación escolar y Línea 102.",
  openGraph: {
    title: "Festi Peques | Mes de las Infancias — La Rioja",
    description:
      "El Estado presente junto a las infancias. Campaña Festi Peques y programas del Ministerio de Desarrollo, Igualdad e Integración Social.",
  },
};

export default function MesDeLasInfanciasPage() {
  return <FestipequesLanding />;
}
