"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-ink/8 bg-brand-cream">
      <div className="section-shell flex items-center justify-between gap-6 py-4 sm:py-5">
        <Link href="/" className="group min-w-0 shrink">
          <Image
            src="/ministerio.svg"
            alt={site.fullName}
            width={420}
            height={90}
            className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left transition-opacity duration-200 group-hover:opacity-80 sm:h-11 sm:max-w-[280px]"
            priority
          />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center font-display text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#383838] sm:text-[0.9rem]">
            {site.nav.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden className="px-2.5 text-brand-gray/70">
                    |
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className="transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <nav aria-label="Principal móvil" className="section-shell overflow-x-auto pb-3 md:hidden">
        <ul className="flex items-center gap-3 whitespace-nowrap font-display text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#383838]">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
