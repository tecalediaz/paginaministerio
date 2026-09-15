"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { needs, type NeedId } from "@/content/needs";
import { areaOf } from "@/content/tramites";
import { searchCatalog } from "@/lib/search";

export function NeedExplorer() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCatalog(query), [query]);
  const searching = query.trim().length > 0;

  return (
    <div>
      <form
        action="/tramites"
        method="get"
        role="search"
        className="relative"
        onSubmit={(event) => {
          if (query.trim()) return;
          event.preventDefault();
        }}
      >
        <label htmlFor="consulta" className="sr-only">
          Buscar programas y trámites
        </label>
        <input
          id="consulta"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ejemplo: deporte, discapacidad, sede, alimentación"
          autoComplete="off"
          className="h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base shadow-[0_8px_30px_rgba(58,58,58,0.06)]"
        />
      </form>

      {searching ? (
        <div className="mt-4" aria-live="polite">
          {results.tramites.length === 0 && results.areas.length === 0 ? (
            <p className="text-fg-muted">
              No hay resultados para “{query}”. Probá con otra palabra o
              consultá en sede.
            </p>
          ) : (
            <div className="space-y-6">
              {results.tramites.length > 0 ? (
                <section>
                  <h2 className="text-sm font-bold tracking-[0.12em] text-fg-muted uppercase">
                    Trámites
                  </h2>
                  <ul className="mt-3 divide-y divide-line border-t border-b border-line">
                    {results.tramites.map((tramite) => (
                      <li key={tramite.slug}>
                        <Link
                          href={`/tramites/${tramite.slug}`}
                          className="flex min-h-11 flex-col py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                        >
                          <span className="font-semibold">{tramite.title}</span>
                          <span className="text-sm text-fg-muted">
                            {areaOf(tramite).name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {results.areas.length > 0 ? (
                <section>
                  <h2 className="text-sm font-bold tracking-[0.12em] text-fg-muted uppercase">
                    Áreas
                  </h2>
                  <ul className="mt-3 divide-y divide-line border-t border-b border-line">
                    {results.areas.map((area) => (
                      <li key={area.slug}>
                        <Link
                          href={`/areas/${area.slug}`}
                          className="flex min-h-11 items-center py-3 font-semibold"
                        >
                          {area.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {needs.map((need) => (
          <li key={need.id}>
            <Link
              href={`/tramites?need=${need.id}`}
              className="flex min-h-[5.5rem] flex-col justify-center border border-line bg-white px-4 py-3 transition-transform hover:-translate-y-0.5"
            >
              <span className="font-bold text-brand-navy">{need.label}</span>
              <span className="mt-1 text-sm text-fg-muted">{need.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NeedPills({ active }: { active?: NeedId }) {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <Link
          href="/tramites"
          className={`inline-flex min-h-11 items-center rounded-[6px] border px-3 text-sm font-semibold ${
            !active ? "border-fg bg-fg text-white" : "border-line bg-white"
          }`}
        >
          Todas
        </Link>
      </li>
      {needs.map((need) => (
        <li key={need.id}>
          <Link
            href={`/tramites?need=${need.id}`}
            className={`inline-flex min-h-11 items-center rounded-[6px] border px-3 text-sm font-semibold ${
              active === need.id
                ? "border-fg bg-fg text-white"
                : "border-line bg-white"
            }`}
          >
            {need.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
