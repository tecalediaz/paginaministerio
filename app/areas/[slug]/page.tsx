import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TramiteCard } from "@/components/TramiteCard";
import { areas, getArea } from "@/content/areas";
import { getNeed } from "@/content/needs";
import { tramitesByArea } from "@/content/tramites";

type Props = {
  params: Promise<{ slug: string }>;
};

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

  const need = getNeed(area.need);
  const related = tramitesByArea(area.slug);

  return (
    <div className="shell py-8 sm:py-12">
      <Breadcrumb
        items={[
          { href: "/", label: "Inicio" },
          { href: "/areas", label: "Áreas" },
          { label: area.name },
        ]}
      />
      <p className="kicker mt-6">
        {area.kind} · {need.label}
      </p>
      <h1 className="mt-2 max-w-4xl text-3xl font-black text-brand-navy sm:text-4xl">
        {area.name}
      </h1>
      <dl className="mt-8 max-w-3xl divide-y divide-line border-t border-b border-line">
        <div className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
          <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
            Qué hace
          </dt>
          <dd>{area.summary}</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
          <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
            A quién atiende
          </dt>
          <dd>{area.audience}</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
          <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
            Cómo consultar
          </dt>
          <dd>{area.access}</dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="text-2xl font-black text-brand-navy">Trámites del área</h2>
        {related.length === 0 ? (
          <p className="mt-4 text-fg-muted">
            Todavía no hay trámites cargados.{" "}
            <Link className="font-bold text-accent-warm" href="/contacto">
              Consultar en sede
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((tramite) => (
              <TramiteCard key={tramite.slug} tramite={tramite} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
