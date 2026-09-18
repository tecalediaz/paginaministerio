import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaLanding } from "@/components/AreaLanding";
import { areas, getArea } from "@/content/areas";
import { listPublishedGestionesByArea } from "@/lib/gestiones";
import { listPublishedTramitesByArea } from "@/lib/tramites";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) {
    return { title: "Área no encontrada" };
  }
  return {
    title: area.name,
    description: area.summary,
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const [gestiones, tramites] = await Promise.all([
    listPublishedGestionesByArea(area.slug),
    listPublishedTramitesByArea(area.slug),
  ]);

  return <AreaLanding area={area} gestiones={gestiones} tramites={tramites} />;
}
