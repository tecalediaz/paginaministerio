"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/content/site";

const COMPACT_AT = 72;
const EXPAND_AT = 8;
const DELTA_DOWN = 6;
const DELTA_UP = 8;
const SETTLE_MS = 320;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const compactRef = useRef(false);
  const ignoreUntil = useRef(0);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${header.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [open, compact]);

  useEffect(() => {
    const main = document.getElementById("contenido");
    const footer = document.querySelector("footer");

    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
    } else {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }

    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    lastY.current = Math.max(0, window.scrollY);

    const applyCompact = (next: boolean) => {
      if (next === compactRef.current) return;
      compactRef.current = next;
      ignoreUntil.current = performance.now() + SETTLE_MS;
      setCompact(next);
    };

    const onScroll = () => {
      if (open) return;

      const y = Math.max(0, window.scrollY);
      const now = performance.now();

      if (now < ignoreUntil.current) {
        lastY.current = y;
        return;
      }

      const delta = y - lastY.current;
      lastY.current = y;

      if (y <= EXPAND_AT) {
        applyCompact(false);
        return;
      }

      if (!compactRef.current && delta >= DELTA_DOWN && y >= COMPACT_AT) {
        applyCompact(true);
        return;
      }

      if (compactRef.current && delta <= -DELTA_UP && y >= COMPACT_AT) {
        applyCompact(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header ref={headerRef} className="header-chrome sticky top-0 z-50">
      <div className="h-1 bg-accent" />
      <div
        className={`header-main border-b border-line bg-white ${
          compact ? "is-compact" : ""
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-3 sm:gap-4 ${
            compact ? "py-2" : "py-3 sm:py-4"
          }`}
        >
          <BrandMark compact={compact} onNavigate={() => setOpen(false)} />
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => {
              const current =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-[6px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    current
                      ? "text-accent-warm"
                      : "text-fg hover:bg-bg-soft"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-[6px] border border-line px-3 text-sm font-bold lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id={menuId} aria-label="Menú móvil" className="mobile-nav lg:hidden">
          <ul className="shell flex flex-col py-2">
            {site.nav.map((item) => {
              const current =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-14 items-center border-b border-line text-lg font-semibold ${
                      current ? "text-accent-warm" : "text-fg"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="shell mt-6 grid gap-3 pb-8">
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-accent font-bold text-white hover:bg-accent-warm"
            >
              Llamar {site.contact.phone}
            </a>
            <a
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-[6px] border border-line font-bold hover:bg-bg-soft"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
