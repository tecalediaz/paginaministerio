"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Gestion } from "@/lib/gestiones";

const AUTOPLAY_MS = 7000;
const MOTION_MS = 880;

function isLocalSrc(src: string) {
  return src.startsWith("/");
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

function GestionPhoto({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  if (isLocalSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 694px, 100vw"
        priority={priority}
        className="object-cover object-center"
      />
    );
  }

  return (
    // Remote CMS (R2 / AlMinisterio): host still unknown until they publish.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
  );
}

function CopyInner({ item }: { item: Gestion }) {
  const titleClass =
    "text-2xl font-black tracking-tight text-balance text-brand-navy sm:text-3xl";

  const title = item.href ? (
    isInternalHref(item.href) ? (
      <h2 className={titleClass}>
        <Link href={item.href}>{item.title}</Link>
      </h2>
    ) : (
      <h2 className={titleClass}>
        <a href={item.href}>{item.title}</a>
      </h2>
    )
  ) : (
    <h2 className={titleClass}>{item.title}</h2>
  );

  return (
    <>
      {title}
      {item.summary ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">{item.summary}</p>
      ) : null}
    </>
  );
}

function MediaFrame({
  item,
  priority,
  hidden,
}: {
  item: Gestion;
  priority?: boolean;
  hidden: boolean;
}) {
  const className = "gestion-feature relative block h-full min-h-[14rem] overflow-hidden rounded-xl";
  const photo = <GestionPhoto src={item.imageUrl} alt={item.imageAlt || item.title} priority={priority} />;

  if (!item.href) {
    return <div className={className}>{photo}</div>;
  }

  if (isInternalHref(item.href)) {
    return (
      <Link href={item.href} className={className} tabIndex={hidden ? -1 : undefined}>
        {photo}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className} tabIndex={hidden ? -1 : undefined}>
      {photo}
    </a>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="gestion-arrow h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
      {dir === "prev" ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function slideMotionClass(i: number, active: number, outgoing: number | null, dir: 1 | -1) {
  if (outgoing === null) {
    return i === active ? "is-active" : "";
  }
  if (i === active) {
    return dir === 1 ? "is-enter-next" : "is-enter-prev";
  }
  if (i === outgoing) {
    return dir === 1 ? "is-leave-next" : "is-leave-prev";
  }
  return "";
}

export function GestionCarousel({ items }: { items: Gestion[] }) {
  const count = items.length;
  const multiple = count > 1;
  const baseId = useId();
  const viewportId = `${baseId}-viewport`;

  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [status, setStatus] = useState("");

  const activeRef = useRef(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduceMotion(mq.matches);
      if (mq.matches) {
        animatingRef.current = false;
        setOutgoing(null);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback(
    (nextIndex: number, direction: 1 | -1, announceChange: boolean) => {
      if (!multiple) return;
      const next = ((nextIndex % count) + count) % count;
      const current = activeRef.current;
      if (next === current || animatingRef.current) return;

      if (announceChange) {
        const item = items[next];
        if (item) {
          setStatus(`Publicación ${next + 1} de ${count}: ${item.title}`);
        }
      }

      if (reduceMotion) {
        setActive(next);
        return;
      }

      animatingRef.current = true;
      setDir(direction);
      setOutgoing(current);
      setActive(next);
    },
    [count, items, multiple, reduceMotion],
  );

  const goToRef = useRef(goTo);

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  useEffect(() => {
    if (!multiple || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      const current = activeRef.current;
      goToRef.current(current + 1, 1, false);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, multiple, paused, reduceMotion]);

  useEffect(() => {
    if (outgoing === null) return;
    const id = window.setTimeout(() => {
      animatingRef.current = false;
      setOutgoing(null);
    }, MOTION_MS);
    return () => window.clearTimeout(id);
  }, [outgoing]);

  const pauseIfMouse = (pointerType: string, value: boolean) => {
    if (pointerType === "mouse") setPaused(value);
  };

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Publicaciones de gestión"
      onPointerEnter={(event) => pauseIfMouse(event.pointerType, true)}
      onPointerLeave={(event) => pauseIfMouse(event.pointerType, false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (!multiple) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(active + 1, 1, true);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(active - 1, -1, true);
        }
      }}
    >
      <div className="gestion-banner">
        <div className="gestion-copy">
          {items.map((item, index) => {
            const hidden = index !== active;
            const motion = slideMotionClass(index, active, outgoing, dir);
            return (
              <div
                key={item.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${count}: ${item.title}`}
                aria-hidden={hidden}
                inert={hidden}
                className={`gestion-copy-slide ${motion}`}
              >
                <CopyInner item={item} />
              </div>
            );
          })}
        </div>

        <div className="gestion-media">
          <div
            id={viewportId}
            className="gestion-viewport relative min-h-[14rem] overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[16/10]"
          >
            {items.map((item, index) => {
              const hidden = index !== active;
              const motion = slideMotionClass(index, active, outgoing, dir);
              return (
                <div key={item.id} aria-hidden={hidden} inert={hidden} className={`gestion-media-slide ${motion}`}>
                  <MediaFrame item={item} priority={index === 0} hidden={hidden} />
                </div>
              );
            })}
          </div>

          {multiple ? (
            <>
              <button
                type="button"
                className="gestion-nav absolute top-1/2 left-1 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45"
                aria-label="Publicación anterior"
                aria-controls={viewportId}
                onClick={() => goTo(active - 1, -1, true)}
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                className="gestion-nav absolute top-1/2 right-1 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45"
                aria-label="Publicación siguiente"
                aria-controls={viewportId}
                onClick={() => goTo(active + 1, 1, true)}
              >
                <Chevron dir="next" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </div>
  );
}
