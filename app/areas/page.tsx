import type { Metadata } from "next";
import { AreaIndex } from "@/components/AreaIndex";
import { Breadcrumb } from "@/components/Breadcrumb";
import { toDirectoryArea } from "@/lib/public-area";
import { listPublicAreas } from "@/lib/public-area-query";

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
  const areas = await listPublicAreas();

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
          areas={areas.map(toDirectoryArea)}
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
