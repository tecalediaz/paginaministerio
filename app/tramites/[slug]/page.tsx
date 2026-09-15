import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ServiceSheet } from "@/components/ServiceSheet";
import { getTramite, tramites } from "@/content/tramites";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tramites.map((tramite) => ({ slug: tramite.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tramite = getTramite(slug);
  if (!tramite) {
    return { title: "Trámite no encontrado" };
  }
  return {
    title: tramite.title,
    description: tramite.summary,
  };
}

export default async function TramitePage({ params }: Props) {
  const { slug } = await params;
  const tramite = getTramite(slug);
  if (!tramite) notFound();

  return (
    <div className="shell py-8 sm:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { href: "/tramites", label: "Programas y trámites" },
          { label: tramite.title },
        ]}
      />
      <div className="mt-8">
        <ServiceSheet tramite={tramite} />
      </div>
    </div>
  );
}
