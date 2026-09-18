"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TramitePosterCard } from "@/components/TramiteCard";
import { needs, type NeedId } from "@/content/needs";
import { searchCatalog } from "@/lib/search";
import { areaOf, type Tramite } from "@/lib/tramite";

export function TramiteCatalog({
  tramites,
  initialQuery,
  initialNeed,
}: {
  tramites: Tramite[];
  initialQuery: string;
  initialNeed?: NeedId;
}) {
  const [query, setQuery] = useState(initialQuery);
  const list = useMemo(
    () => searchCatalog(query, tramites, initialNeed ?? "todas").tramites,
    [query, tramites, initialNeed],
  );
  const ministry = useMemo(
    () => list.filter((tramite) => tramite.kind === "pagos"),
    [list],
  );
  const groups = useMemo(
    () =>
      needs
        .map((need) => ({
          id: need.id,
          label: need.label,
          items: list.filter(
            (tramite) =>
              tramite.kind !== "pagos" && tramite.need === need.id,
          ),
        }))
        .filter((group) => group.items.length > 0),
    [list],
  );
  const catalogGroups = [
    ...(ministry.length > 0
      ? [{ id: "ministerio", label: "Ministerio", items: ministry }]
      : []),
    ...groups,
  ];

  return (
    <div className="tramite-catalog">
      <form action="/tramites" method="get" role="search">
        {initialNeed ? (
          <input type="hidden" name="need" value={initialNeed} />
        ) : null}
        <label htmlFor="tramites-q" className="sr-only">
          Buscar programas y trámites
        </label>
        <input
          id="tramites-q"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Deporte, discapacidad, alimentación…"
          autoComplete="off"
          className="h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base shadow-[0_8px_30px_rgba(58,58,58,0.06)]"
        />
      </form>

      {list.length === 0 ? (
        <p className="catalog-empty">
          No hay trámites para este filtro. Consultá en sede.
        </p>
      ) : (
        <div className="catalog-groups">
          {catalogGroups.map((group) => (
            <section
              key={group.id}
              className="catalog-group"
              aria-labelledby={`catalog-${group.id}`}
            >
              <h2 id={`catalog-${group.id}`} className="catalog-kicker">
                {group.label}
              </h2>
              <ul className={group.items.some((item) => item.image) ? "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "catalog-list"}>
                {group.items.map((tramite) =>
                  tramite.image ? (
                    <li key={tramite.slug} className="max-w-sm">
                      <TramitePosterCard tramite={tramite} />
                    </li>
                  ) : (
                    <CatalogRow key={tramite.slug} tramite={tramite} />
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogRow({ tramite }: { tramite: Tramite }) {
  const area = areaOf(tramite);

  return (
    <li className="catalog-row">
      <Link href={`/tramites/${tramite.slug}`} className="catalog-row__link">
        <span className="catalog-row__title">{tramite.title}</span>
        <span className="catalog-row__meta">{area.name}</span>
      </Link>
    </li>
  );
}
