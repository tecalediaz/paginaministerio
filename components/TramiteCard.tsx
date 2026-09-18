import Image from "next/image";
import Link from "next/link";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { areaOf, type Tramite } from "@/lib/tramite";

function CardMedia({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 45vw, 90vw"
        className="object-cover object-center"
      />
    );
  }

  return (
    // Remote CMS (R2 / AlMinisterio).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  );
}

function InstitutionalCover() {
  return (
    <div className="relative flex aspect-[3/4] items-center justify-center bg-bg-deep px-10">
      <Image
        src="/logo-gob-rioja.svg"
        alt=""
        width={96}
        height={110}
        className="h-28 w-auto"
      />
    </div>
  );
}

export function TramitePosterCard({ tramite }: { tramite: Tramite }) {
  const photo = tramite.image;

  return (
    <article className="h-full overflow-hidden rounded-xl bg-white">
      {photo?.replaceWith ? (
        <PlaceholderPhoto
          photo={{
            src: photo.src,
            alt: photo.alt,
            replaceWith: photo.replaceWith,
          }}
          className="aspect-[3/4]"
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 45vw, 90vw"
          compact
        />
      ) : photo ? (
        <div className="relative aspect-[3/4] overflow-hidden bg-bg-deep">
          <CardMedia src={photo.src} alt={photo.alt} />
        </div>
      ) : (
        <InstitutionalCover />
      )}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="text-lg font-bold text-pretty text-brand-navy sm:text-xl">
          {tramite.title}
        </h3>
        <Link
          href={`/tramites/${tramite.slug}`}
          aria-label={`Acceder: ${tramite.title}`}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-[6px] bg-accent px-5 font-bold text-white hover:bg-accent-warm"
        >
          Acceder
        </Link>
      </div>
    </article>
  );
}

export function TramiteCard({ tramite }: { tramite: Tramite }) {
  const area = areaOf(tramite);

  return (
    <article className="flex h-full flex-col border-l-[3px] border-accent bg-white p-5 shadow-[0_1px_0_rgba(58,58,58,0.06)]">
      <p className="text-xs font-bold tracking-[0.12em] text-fg-muted uppercase">
        {area.kind}
      </p>
      <h3 className="mt-2 min-w-0 text-xl font-bold text-brand-navy">
        <Link className="hover:text-accent-warm" href={`/tramites/${tramite.slug}`}>
          {tramite.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
        {tramite.summary}
      </p>
      {tramite.who ? (
        <p className="mt-4 text-sm">Para: {tramite.who}</p>
      ) : null}
      <Link
        href={`/tramites/${tramite.slug}`}
        aria-label={`Acceder: ${tramite.title}`}
        className="mt-5 inline-flex min-h-11 items-center font-bold text-accent-warm"
      >
        Acceder
      </Link>
    </article>
  );
}
