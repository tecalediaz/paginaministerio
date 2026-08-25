import type { Metadata } from "next";
import { FestipequesLanding } from "@/components/infancias/FestipequesLanding";

export const metadata: Metadata = {
  title: "Infancias Cuidadas",
  description:
    "Infancias Cuidadas en La Rioja. Recursos del Ministerio de Desarrollo, Igualdad e Integración Social para las infancias: F.E.S., primera infancia, alimentación escolar y Línea 102.",
  openGraph: {
    title: "Infancias Cuidadas — La Rioja",
    description:
      "El Estado presente junto a las infancias. Campaña Infancias Cuidadas y programas del Ministerio de Desarrollo, Igualdad e Integración Social.",
  },
};

export default function MesDeLasInfanciasPage() {
  return <FestipequesLanding />;
}
