import type { Metadata } from "next";
import { AreaCard } from "@/components/AreaCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { areas } from "@/content/areas";

export const metadata: Metadata = {
  title: "Áreas",
  description:
    "Directorio de áreas del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

export default function AreasPage() {
  return (
    <div className="shell py-8 sm:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Áreas" },
        ]}
      />
      <p className="kicker mt-6">Ministerio</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">Áreas</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">
        Listado de secretarías, subsecretarías, direcciones y consejos. No
        publicamos titulares de cada área.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {areas.map((area) => (
          <AreaCard key={area.slug} area={area} />
        ))}
      </div>
    </div>
  );
}
