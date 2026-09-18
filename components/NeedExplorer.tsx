"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { needPhotos } from "@/content/home-photos";
import { needs } from "@/content/needs";
import { searchCatalog } from "@/lib/search";
import type { Tramite } from "@/lib/tramite";

export function NeedExplorer({ tramites }: { tramites: Tramite[] }) {
  const [query, setQuery] = useState("");
  const { areas: areaHits, tramites: tramiteHits } = useMemo(
    () => searchCatalog(query, tramites),
    [query, tramites],
  );
  const searching = query.trim().length > 0;
  const noHits = areaHits.length === 0 && tramiteHits.length === 0;

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
          placeholder="Deporte, discapacidad, alimentación…"
          autoComplete="off"
          className="h-14 w-full rounded-[6px] border border-line bg-white px-4 text-base shadow-[0_8px_30px_rgba(58,58,58,0.06)]"
        />
      </form>

      {searching ? (
        <div className="mt-4 grid gap-6" aria-live="polite">
          {noHits ? (
            <p className="text-fg-muted">
              Todavía no hay trámites disponibles. Consultá en sede o por
              teléfono.
            </p>
          ) : null}
          {tramiteHits.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold tracking-[0.12em] text-fg-muted uppercase">
                Programas y trámites
              </h2>
              <ul className="mt-3 divide-y divide-line border-t border-b border-line">
                {tramiteHits.map((tramite) => (
                  <li key={tramite.slug}>
                    <Link
                      href={`/tramites/${tramite.slug}`}
                      className="flex min-h-11 items-center py-3 font-semibold"
                    >
                      {tramite.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {areaHits.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold tracking-[0.12em] text-fg-muted uppercase">
                Áreas
              </h2>
              <ul className="mt-3 divide-y divide-line border-t border-b border-line">
                {areaHits.map((area) => (
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
      ) : null}

      <NeedRail>
        {needs.map((need) => (
          <li key={need.id} className="need-rail__item">
            <Link
              href={`/tramites?need=${need.id}`}
              className="relative block min-h-11 h-full overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5 max-sm:hover:translate-y-0"
            >
              <PlaceholderPhoto
                photo={needPhotos[need.id]}
                className="aspect-[3/4]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
                compact
                overlay={
                  <span className="block text-base font-bold text-pretty text-fg-on-dark sm:text-lg lg:text-xl">
                    {need.label}
                  </span>
                }
              />
            </Link>
          </li>
        ))}
      </NeedRail>
    </div>
  );
}

function NeedRail({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    if (!wrap || !rail) return;

    const updateEdges = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const left = rail.scrollLeft;
      wrap.dataset.overflowLeft = left > 8 ? "true" : "false";
      wrap.dataset.overflowRight = max > 8 && left < max - 8 ? "true" : "false";
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;
      const next = rail.scrollLeft + event.deltaY;
      const clamped = Math.max(0, Math.min(max, next));
      if (clamped === rail.scrollLeft) return;
      event.preventDefault();
      rail.scrollLeft = clamped;
    };

    const DRAG_THRESHOLD = 6;
    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const setDragging = (value: boolean) => {
      if (value) {
        rail.dataset.dragging = "true";
      } else {
        delete rail.dataset.dragging;
      }
    };

    const suppressClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      setDragging(false);
      if (moved) {
        rail.addEventListener("click", suppressClick, {
          capture: true,
          once: true,
        });
      }
      if (rail.hasPointerCapture(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId);
      }
    };

    const onDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      moved = false;
      setDragging(false);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      if (event.pointerType === "touch") return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD) return;
      moved = true;
      setDragging(true);
      if (!rail.hasPointerCapture(event.pointerId)) {
        rail.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      rail.scrollLeft = startScroll - dx;
    };

    updateEdges();
    rail.addEventListener("scroll", updateEdges, { passive: true });
    rail.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("dragstart", onDragStart);
    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    const observer = new ResizeObserver(updateEdges);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("dragstart", onDragStart);
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", endDrag);
      rail.removeEventListener("pointercancel", endDrag);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="need-rail-wrap mt-6"
      data-overflow-left="false"
      data-overflow-right="true"
    >
      <ul
        ref={railRef}
        className="need-rail"
        aria-label="Atajos por necesidad"
      >
        {children}
      </ul>
    </div>
  );
}
