"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { areas, type Area } from "@/content/areas";
import { searchCatalog } from "@/lib/search";

const KIND_ORDER = [
  "Secretaría",
  "Subsecretaría",
  "Dirección general",
  "Consejo",
  "Coordinación",
  "Mesa de entrada",
] as const;

function groupAreasByKind(list: Area[]) {
  const buckets = new Map<string, Area[]>();
  for (const area of list) {
    const current = buckets.get(area.kind);
    if (current) current.push(area);
    else buckets.set(area.kind, [area]);
  }

  const ordered: { kind: string; items: Area[] }[] = [];
  for (const kind of KIND_ORDER) {
    const items = buckets.get(kind);
    if (!items) continue;
    ordered.push({ kind, items });
    buckets.delete(kind);
  }
  for (const [kind, items] of buckets) {
    ordered.push({ kind, items });
  }
  return ordered;
}

function kindDomId(kind: string) {
  return `area-kind-${kind
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function DirectoryChevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type AreaIndexProps = {
  headingLevel?: "h1" | "h2";
  title?: string;
  titleHref?: string;
  showDirectoryCta?: boolean;
  searchable?: boolean;
  initialQuery?: string;
  showKicker?: boolean;
};

export function AreaIndex({
  headingLevel = "h2",
  title = "Áreas",
  titleHref,
  showDirectoryCta = true,
  searchable = false,
  initialQuery = "",
  showKicker = true,
}: AreaIndexProps) {
  const [query, setQuery] = useState(initialQuery);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const list = useMemo(
    () => (searchable ? searchCatalog(query).areas : areas),
    [query, searchable],
  );
  const groups = groupAreasByKind(list);
  const Heading = headingLevel;
  const GroupHeading = headingLevel === "h1" ? "h2" : "h3";
  const directoryHref = titleHref ?? (headingLevel === "h2" ? "/areas" : undefined);
  const headingClass = "text-3xl font-black text-brand-navy";

  useEffect(() => {
    if (!openSlug) return;

    function closeIfOutside(event: globalThis.PointerEvent) {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node)) return;
      if (root.contains(event.target)) return;
      setOpenSlug(null);
      const active = document.activeElement;
      if (active instanceof HTMLElement && root.contains(active)) {
        active.blur();
      }
    }

    document.addEventListener("pointerdown", closeIfOutside);
    return () => document.removeEventListener("pointerdown", closeIfOutside);
  }, [openSlug]);

  function onAreaClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    const native = event.nativeEvent;
    const pointer =
      "pointerType" in native && typeof native.pointerType === "string"
        ? native.pointerType
        : "";
    if (pointer !== "touch" && pointer !== "pen") return false;
    if (openSlug === slug) return false;
    event.preventDefault();
    setOpenSlug(slug);
    return true;
  }

  return (
    <div ref={rootRef}>
      {showKicker ? <p className="kicker">Ministerio</p> : null}
      {directoryHref ? (
        <div
          className={`flex items-center gap-1 ${showKicker ? "mt-2" : ""}`}
        >
          <Heading className={headingClass}>
            <Link
              href={directoryHref}
              className="inline-flex min-h-11 items-center rounded-[6px] hover:text-accent-warm"
            >
              {title}
            </Link>
          </Heading>
          <Link
            href={directoryHref}
            aria-label="Ver todas las áreas"
            title="Ver todas las áreas"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] text-brand-navy hover:text-accent-warm"
          >
            <DirectoryChevron />
          </Link>
        </div>
      ) : (
        <Heading
          className={showKicker ? `mt-2 ${headingClass}` : headingClass}
        >
          {title}
        </Heading>
      )}

      {searchable ? (
        <form action="/areas" method="get" role="search" className="mt-6">
          <label htmlFor="areas-q" className="sr-only">
            Buscar áreas
          </label>
          <input
            id="areas-q"
            name="q"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpenSlug(null);
            }}
            placeholder="Deportes, niñez, alimentación…"
            autoComplete="off"
            className="h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base shadow-[0_8px_30px_rgba(58,58,58,0.06)]"
          />
        </form>
      ) : null}

      {list.length === 0 ? (
        <p className="catalog-empty">
          No hay áreas para este filtro. Consultá en sede.
        </p>
      ) : (
        <div
          className={`grid grid-cols-1 gap-5 ${searchable ? "mt-6" : "mt-8"}`}
        >
          {groups.map((group) => {
            const headingId = kindDomId(group.kind);
            return (
              <section
                key={group.kind}
                aria-labelledby={headingId}
                className="area-index__group min-w-0 overflow-hidden bg-white sm:grid sm:grid-cols-[12.75rem_minmax(0,1fr)]"
              >
                <GroupHeading
                  id={headingId}
                  className="kicker bg-bg px-4 py-3 sm:flex sm:items-start sm:px-5 sm:py-5"
                >
                  {group.kind}
                </GroupHeading>
                <ul className="min-w-0">
                  {group.items.map((area) => (
                    <li
                      key={area.slug}
                      className={`area-index__item border-t border-line sm:first:border-t-0${
                        openSlug === area.slug ? " is-open" : ""
                      }`}
                    >
                      <Link
                        href={`/areas/${area.slug}`}
                        className="group block min-h-11 px-4 py-3 text-brand-navy hover:bg-bg sm:px-5"
                        onClick={(event) => {
                          onAreaClick(event, area.slug);
                        }}
                      >
                        <span className="block text-pretty font-bold group-hover:text-accent-warm">
                          {area.name}
                        </span>
                        <span className="area-index__reveal">
                          <span className="area-index__reveal-inner">
                            <span className="area-index__summary">
                              {area.summary}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {showDirectoryCta ? (
        <Link
          href="/areas"
          className="mt-6 inline-flex min-h-11 items-center font-bold text-accent-warm"
        >
          Directorio de áreas
        </Link>
      ) : null}
    </div>
  );
}
