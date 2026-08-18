"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { site } from "@/content/site";

const socialIcons: Record<(typeof site.social)[number]["id"], ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.11.19 2.11.19v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L2.25 2.25h7.08l4.263 5.686L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
      <path d="M16.6 5.82A4.17 4.17 0 0 1 14.9 2h-3.2v12.4a2.54 2.54 0 0 1-2.58 2.5 2.54 2.54 0 0 1-2.57-2.5 2.54 2.54 0 0 1 2.57-2.5c.27 0 .53.04.78.11V8.74a5.99 5.99 0 0 0-.78-.05A5.74 5.74 0 0 0 3.4 14.4a5.74 5.74 0 0 0 5.72 5.76A5.74 5.74 0 0 0 14.84 14.4V8.61a7.3 7.3 0 0 0 4.26 1.36V6.78a4.2 4.2 0 0 1-2.5-.96Z" />
    </svg>
  ),
};

export function Header() {
  const pathname = usePathname();
  const showInicio = pathname !== "/";

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 bg-white">
      <div className="section-shell relative flex items-center justify-between gap-4 py-3 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
          <Link
            href="/"
            className="group flex min-w-0 shrink items-center gap-4 sm:gap-5"
          >
            <Image
              src="/logo-gob-rioja.svg"
              alt="Escudo de la Provincia de La Rioja"
              width={40}
              height={46}
              className="h-8 w-auto shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-85 sm:h-9"
              priority
            />
            <Image
              src="/ministerio.svg"
              alt={site.fullName}
              width={280}
              height={60}
              className="h-8 w-auto max-w-[min(100%,200px)] object-contain object-left transition-opacity duration-200 group-hover:opacity-85 sm:h-9 sm:max-w-[240px]"
              priority
            />
          </Link>

          <ul
            aria-label="Redes sociales"
            className="flex shrink-0 items-center gap-0.5 border-l border-fg/15 pl-3 sm:pl-3.5"
          >
            {site.social.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg/75 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:bg-fg/5 hover:text-accent"
                >
                  {socialIcons[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {showInicio ? (
          <nav
            aria-label="Principal"
            className="hidden items-center gap-5 text-sm font-medium text-fg sm:flex"
          >
            <Link href="/" className="transition-colors hover:text-accent">
              Inicio
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
