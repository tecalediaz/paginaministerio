import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ServiceSheet } from "@/components/ServiceSheet";
import { listPublishedPagos } from "@/lib/pagos";
import { getPublishedTramite } from "@/lib/tramites";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tramite = await getPublishedTramite(slug);
  if (!tramite) {
    return { title: "Trámite no encontrado" };
  }
  return {
    title: tramite.title,
    description: tramite.summary || tramite.title,
  };
}

export default async function TramitePage({ params }: Props) {
  const { slug } = await params;
  const tramite = await getPublishedTramite(slug);
  if (!tramite) notFound();
  const pagos =
    tramite.kind === "pagos" ? await listPublishedPagos(tramite.slug) : [];

  return (
    <div className="shell pt-4 pb-8 sm:pt-6 sm:pb-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { href: "/tramites", label: "Programas y trámites" },
          { label: tramite.title },
        ]}
      />
      <div className="mt-8">
        <ServiceSheet tramite={tramite} pagos={pagos} />
      </div>
    </div>
  );
}
