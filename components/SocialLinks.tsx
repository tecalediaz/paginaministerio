import type { ReactNode } from "react";
import { site, type SocialId } from "@/content/site";

const icons: Record<SocialId, ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.11.19 2.11.19v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L2.25 2.25h7.08l4.263 5.686L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M16.6 5.82A4.17 4.17 0 0 1 14.9 2h-3.2v12.4a2.54 2.54 0 0 1-2.58 2.5 2.54 2.54 0 0 1-2.57-2.5 2.54 2.54 0 0 1 2.57-2.5c.27 0 .53.04.78.11V8.74a5.99 5.99 0 0 0-.78-.05A5.74 5.74 0 0 0 3.4 14.4a5.74 5.74 0 0 0 5.72 5.76A5.74 5.74 0 0 0 14.84 14.4V8.61a7.3 7.3 0 0 0 4.26 1.36V6.78a4.2 4.2 0 0 1-2.5-.96Z" />
    </svg>
  ),
};

export function SocialLinks({ inverted = false }: { inverted?: boolean }) {
  return (
    <ul
      aria-label="Redes sociales"
      className="flex items-center gap-2"
    >
      {site.social.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[6px] transition-colors ${
              inverted
                ? "text-fg-on-dark/80 hover:bg-white/10 hover:text-white"
                : "text-fg hover:bg-bg-soft hover:text-accent-warm"
            }`}
          >
            {icons[item.id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
