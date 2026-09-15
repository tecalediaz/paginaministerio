"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="h-1 bg-accent" />
      <p className="border-b border-line bg-bg-soft py-1.5 text-center text-[11px] font-semibold tracking-[0.14em] text-fg-muted uppercase">
        {site.province}
      </p>
      <div className="shell flex items-center justify-between gap-4 py-3 sm:py-4">
        <BrandMark onNavigate={() => setOpen(false)} />
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
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-[6px] border border-line px-3 text-sm font-bold lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      {open ? (
        <nav
          id={menuId}
          aria-label="Menú móvil"
          className="border-t border-line bg-white lg:hidden"
        >
          <ul className="shell flex flex-col py-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-11 py-3 text-base font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
