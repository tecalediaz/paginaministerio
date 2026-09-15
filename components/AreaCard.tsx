import Link from "next/link";
import type { Area } from "@/content/areas";
import { getNeed } from "@/content/needs";

export function AreaCard({ area }: { area: Area }) {
  const need = getNeed(area.need);

  return (
    <article className="flex h-full flex-col border border-line bg-white p-5">
      <p className="text-xs font-bold tracking-[0.12em] text-fg-muted uppercase">
        {area.kind} · {need.label}
      </p>
      <h3 className="mt-2 text-lg font-bold text-brand-navy">
        <Link className="hover:text-accent-warm" href={`/areas/${area.slug}`}>
          {area.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
        {area.summary}
      </p>
      <Link
        href={`/areas/${area.slug}`}
        className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm"
      >
        Ver área
      </Link>
    </article>
  );
}
