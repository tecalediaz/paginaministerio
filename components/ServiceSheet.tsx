import Link from "next/link";
import { getNeed } from "@/content/needs";
import { site } from "@/content/site";
import { areaOf, type Tramite } from "@/content/tramites";

export function ServiceSheet({ tramite }: { tramite: Tramite }) {
  const area = areaOf(tramite);
  const need = getNeed(tramite.need);

  const rows: { label: string; value: string; href?: string }[] = [
    { label: "Qué es", value: tramite.summary },
    { label: "Quién puede acceder", value: tramite.who },
    { label: "Qué llevar / requisitos", value: tramite.requirements.join(" ") },
    { label: "Dónde", value: tramite.where },
    { label: "Cuándo", value: tramite.when },
    { label: "Área responsable", value: area.name, href: `/areas/${area.slug}` },
    { label: "Contacto", value: tramite.contact },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
      <article>
        <p className="kicker">{need.label}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">
          {tramite.title}
        </h1>
        <dl className="mt-8 divide-y divide-line border-t border-b border-line">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr]">
              <dt className="text-sm font-bold tracking-wide text-fg-muted uppercase">
                {row.label}
              </dt>
              <dd>
                {row.href ? (
                  <Link className="font-semibold text-accent-warm" href={row.href}>
                    {row.value}
                  </Link>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </article>
      <aside className="h-fit border border-line bg-white p-5">
        <p className="text-sm font-bold">¿Necesitás orientación ahora?</p>
        <p className="mt-2 text-sm text-fg-muted">
          {site.contact.address}. {site.contact.hours}.
        </p>
        <a
          className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm"
          href={site.contact.phoneHref}
        >
          Llamar {site.contact.phone}
        </a>
        <br />
        <a
          className="inline-flex min-h-11 items-center font-bold text-accent-warm"
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Escribir por WhatsApp
        </a>
      </aside>
    </div>
  );
}
