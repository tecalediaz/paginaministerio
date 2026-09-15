import Link from "next/link";
import type { Tramite } from "@/content/tramites";
import { areaOf } from "@/content/tramites";

export function TramiteCard({ tramite }: { tramite: Tramite }) {
  const area = areaOf(tramite);

  return (
    <article className="flex h-full flex-col border-l-[3px] border-accent bg-white p-5 shadow-[0_1px_0_rgba(58,58,58,0.06)]">
      <p className="text-xs font-bold tracking-[0.12em] text-fg-muted uppercase">
        {area.kind}
      </p>
      <h3 className="mt-2 text-xl font-bold text-brand-navy">
        <Link className="hover:text-accent-warm" href={`/tramites/${tramite.slug}`}>
          {tramite.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
        {tramite.summary}
      </p>
      <p className="mt-4 text-sm">
        Para: {tramite.who}
      </p>
      <Link
        href={`/tramites/${tramite.slug}`}
        className="mt-5 inline-flex min-h-11 items-center font-bold text-accent-warm"
      >
        Cómo acceder
      </Link>
    </article>
  );
}
