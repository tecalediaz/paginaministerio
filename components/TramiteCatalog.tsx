"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { TramitePosterCard } from "@/components/TramiteCard";
import { type NeedId } from "@/content/needs";
import { searchCatalog } from "@/lib/search";
import type { Tramite } from "@/lib/tramite";

function masonryCols() {
  if (typeof window === "undefined") return 2;
  if (window.matchMedia("(min-width: 1280px)").matches) return 4;
  if (window.matchMedia("(min-width: 768px)").matches) return 3;
  return 2;
}

function subscribeMasonry(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

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
  const cols = useSyncExternalStore(subscribeMasonry, masonryCols, () => 2);
  const columns = useMemo(() => {
    const buckets: Tramite[][] = Array.from({ length: cols }, () => []);
    list.forEach((tramite, index) => {
      buckets[index % cols].push(tramite);
    });
    return buckets;
  }, [cols, list]);

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
        <div
          className="catalog-masonry mt-6"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {columns.map((column, index) => (
            <ul
              key={index}
              className="catalog-masonry__col"
              aria-label={index === 0 ? "Programas y trámites" : undefined}
            >
              {column.map((tramite) => (
                <li key={tramite.slug}>
                  <TramitePosterCard tramite={tramite} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </div>
  );
}
