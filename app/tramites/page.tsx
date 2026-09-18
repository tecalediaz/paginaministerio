import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TramiteCatalog } from "@/components/TramiteCatalog";
import { needs, type NeedId } from "@/content/needs";
import { listPublishedTramites } from "@/lib/tramites";

export const metadata: Metadata = {
  title: "Programas y trámites",
  description:
    "Programas y trámites del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

export const revalidate = 120;

function parseNeed(value?: string): NeedId | undefined {
  return needs.find((item) => item.id === value)?.id;
}

export default async function TramitesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; need?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const need = parseNeed(params.need);
  const tramites = await listPublishedTramites();

  return (
    <div className="shell pt-4 pb-8 sm:pt-6 sm:pb-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Programas y trámites" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">
        Programas y trámites
      </h1>
      {tramites.length > 0 ? (
        <TramiteCatalog
          tramites={tramites}
          initialQuery={q}
          initialNeed={need}
        />
      ) : (
        <p className="mt-6 max-w-2xl text-fg-muted">
          Todavía no hay trámites disponibles. Consultá en{" "}
          <Link className="font-bold text-accent-warm" href="/contacto">
            sede
          </Link>{" "}
          o por teléfono.
        </p>
      )}
    </div>
  );
}
