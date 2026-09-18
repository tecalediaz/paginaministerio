import Image from "next/image";
import type { ReactNode } from "react";
import type { HomePhoto } from "@/content/home-photos";

export function PlaceholderPhoto({
  photo,
  className = "",
  sizes = "100vw",
  priority = false,
  compact = false,
  overlay,
  overlayClassName = "",
}: {
  photo: HomePhoto;
  className?: string;
  sizes?: string;
  priority?: boolean;
  compact?: boolean;
  overlay?: ReactNode;
  overlayClassName?: string;
}) {
  return (
    <figure className={`relative isolate overflow-hidden bg-bg-deep ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className={
          overlay
            ? "absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-bg-deep/45 to-bg-deep/15"
            : compact
              ? "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              : "absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
        }
      />
      <figcaption
        className={
          overlay
            ? "absolute inset-x-0 top-0 p-2.5 text-fg-on-dark sm:p-3"
            : compact
              ? "absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-3.5"
              : "absolute inset-x-0 bottom-0 p-3 text-white sm:p-4"
        }
      >
        <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#8fd18f] uppercase">
          Reemplazar esta foto
        </p>
        {overlay ? (
          <p className="sr-only">{photo.replaceWith}</p>
        ) : (
          <p
            className={
              compact
                ? "mt-0.5 text-[11px] font-semibold leading-snug sm:text-sm"
                : "mt-1 text-xs font-semibold leading-snug sm:text-sm"
            }
          >
            {photo.replaceWith}
          </p>
        )}
      </figcaption>
      {overlay ? (
        <div
          className={
            overlayClassName
              ? `absolute inset-x-0 bottom-0 z-10 text-fg-on-dark ${overlayClassName}`
              : "absolute inset-x-0 bottom-0 z-10 px-4 py-3 text-fg-on-dark sm:px-4 sm:py-3.5"
          }
        >
          {overlay}
        </div>
      ) : null}
    </figure>
  );
}
