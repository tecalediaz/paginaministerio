import Link from "next/link";
import type { PublicAreaView } from "@/lib/public-area";

export function AreaCard({ area }: { area: PublicAreaView }) {
  return (
    <article className="flex h-full flex-col border border-line bg-white p-5">
      <p className="text-xs font-bold tracking-[0.12em] text-fg-muted uppercase">
        {area.kind} · {area.needLabel}
      </p>
      <h3 className="mt-2 min-w-0 text-lg font-bold text-brand-navy">
        <Link className="hover:text-accent-warm" href={`/areas/${area.slug}`}>
          {area.name}
        </Link>
      </h3>
      {area.summary ? (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
          {area.summary}
        </p>
      ) : null}
      <Link
        href={`/areas/${area.slug}`}
        className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm"
      >
        Ver área
      </Link>
    </article>
  );
}
