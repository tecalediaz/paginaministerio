import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NeedPills } from "@/components/NeedExplorer";
import { TramiteCard } from "@/components/TramiteCard";
import { needs, type NeedId } from "@/content/needs";
import { searchCatalog } from "@/lib/search";

export const metadata: Metadata = {
  title: "Programas y trámites",
  description:
    "Listado de programas y trámites del Ministerio de Desarrollo, Igualdad e Integración Social de La Rioja.",
};

function isNeed(value: string | undefined): value is NeedId {
  return needs.some((need) => need.id === value);
}

export default async function TramitesPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string; q?: string }>;
}) {
  const params = await searchParams;
  const need = isNeed(params.need) ? params.need : undefined;
  const q = params.q?.trim() ?? "";
  const list = searchCatalog(q, need ?? "todas").tramites;
  const label = need ? needs.find((item) => item.id === need)?.label : null;

  return (
    <div className="shell py-8 sm:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { label: "Programas y trámites" },
        ]}
      />
      <p className="kicker mt-6">Servicios</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">
        Programas y trámites
      </h1>
      <p className="mt-3 max-w-2xl text-fg-muted">
        Fichas de acceso. Si un requisito no figura, se consulta en sede: no
        publicamos documentación que no esté confirmada.
      </p>
      <div className="mt-6">
        <NeedPills active={need} />
      </div>
      <p className="mt-6 text-sm text-fg-muted">
        {list.length} resultado{list.length === 1 ? "" : "s"}
        {label ? ` · ${label}` : ""}
        {q ? ` · “${q}”` : ""}
      </p>
      {list.length === 0 ? (
        <p className="mt-8">No hay trámites para este filtro. Consultá en sede.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((tramite) => (
            <TramiteCard key={tramite.slug} tramite={tramite} />
          ))}
        </div>
      )}
    </div>
  );
}
