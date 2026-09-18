import type { Metadata } from "next";
import { AreaIndex } from "@/components/AreaIndex";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Áreas",
  description:
    "Directorio de áreas del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

export default async function AreasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  return (
    <div className="shell pt-4 pb-8 sm:pt-6 sm:pb-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Áreas" },
        ]}
      />
      <div className="mt-6">
        <AreaIndex
          headingLevel="h1"
          title="Áreas"
          showDirectoryCta={false}
          showKicker={false}
          searchable
          initialQuery={q}
        />
      </div>
    </div>
  );
}
