import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { SedeHours } from "@/components/SedeHours";
import {
  SocialLinks,
  SocialNetworkButtons,
  consultSocialItems,
  socialItemsFrom,
} from "@/components/SocialLinks";
import { TramitePosterCard } from "@/components/TramiteCard";
import type { Area } from "@/content/areas";
import { photoForArea } from "@/content/home-photos";
import { getNeed } from "@/content/needs";
import { site } from "@/content/site";
import type { Tramite } from "@/lib/tramite";
import type { Gestion } from "@/lib/gestiones";

function isLocalSrc(src: string) {
  return src.startsWith("/");
}

function DestacadoMedia({ src, alt }: { src: string; alt: string }) {
  if (isLocalSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="object-cover object-center"
      />
    );
  }

  return (
    // Remote CMS (R2 / AlMinisterio): host still unknown until they publish.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  );
}

function DestacadoCard({ item }: { item: Gestion }) {
  const media = (
    <div className="relative aspect-[16/10] overflow-hidden">
      <DestacadoMedia src={item.imageUrl} alt={item.imageAlt} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-bg-deep/40 to-bg-deep/10"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 py-3.5 sm:px-5 sm:py-4">
        <h3 className="text-lg font-bold text-pretty text-fg-on-dark sm:text-xl">
          {item.title}
        </h3>
      </div>
    </div>
  );

  const body = item.summary ? (
    <p className="px-4 py-3.5 text-sm leading-relaxed text-fg-muted sm:px-5">
      {item.summary}
    </p>
  ) : null;

  const cardClass = "block overflow-hidden rounded-xl bg-white";

  if (!item.href) {
    return (
      <article className={cardClass}>
        {media}
        {body}
      </article>
    );
  }

  if (item.href.startsWith("/")) {
    return (
      <article>
        <Link href={item.href} className={cardClass}>
          {media}
          {body}
        </Link>
      </article>
    );
  }

  return (
    <article>
      <a href={item.href} className={cardClass}>
        {media}
        {body}
      </a>
    </article>
  );
}

export function AreaLanding({
  area,
  gestiones,
  tramites,
}: {
  area: Area;
  gestiones: Gestion[];
  tramites: Tramite[];
}) {
  const photo = photoForArea(area);
  const need = getNeed(area.need);
  const social = socialItemsFrom(area.social);
  const consultSocial = consultSocialItems(area.social);

  return (
    <div className="pt-4 pb-8 sm:pt-6 sm:pb-12">
      <div className="shell">
        <Breadcrumb
          items={[
            { href: "/", label: "Inicio" },
            { href: "/areas", label: "Áreas" },
            { label: area.name },
          ]}
        />

        <section className="mt-4 sm:mt-5" aria-labelledby="area-title">
          <PlaceholderPhoto
            photo={photo}
            className="area-banner rounded-xl"
            sizes="(min-width: 1120px) 1120px, calc(100vw - 2rem)"
            priority
            overlayClassName="px-5 py-5 sm:px-8 sm:py-8"
            overlay={
              <>
                <p className="kicker">
                  {area.kind} · {need.label}
                </p>
                <h1 id="area-title" className="area-banner__title">
                  {area.name}
                </h1>
              </>
            }
          />
        </section>

        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:items-start lg:gap-12">
          <section aria-label="Información del área">
            <p className="kicker">El área</p>
            <p className="area-lead mt-4">{area.summary}</p>
            <div className="mt-8 border-t border-line pt-8">
              <h2 className="kicker">A quién atiende</h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed">{area.audience}</p>
            </div>
          </section>

          <aside className="area-consult h-fit bg-white px-5 py-6 sm:px-6 sm:py-7">
            <p className="kicker">Consultar</p>
            <p className="mt-3 leading-relaxed">{area.access}</p>
            <p className="mt-5 font-bold text-brand-navy">{site.contact.address}</p>
            <p className="text-fg-muted">{site.contact.city}</p>
            <div className="mt-4">
              <p className="text-xs font-extrabold tracking-[0.16em] text-fg-muted uppercase">
                Horario
              </p>
              <SedeHours hours={site.contact.hours} />
            </div>
            <div className="mt-6 grid gap-3">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-accent font-bold text-white hover:bg-accent-warm"
                href="/contacto"
              >
                Ver sede
              </Link>
            </div>
            {consultSocial.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-extrabold tracking-[0.16em] text-fg-muted uppercase">
                  Redes
                </p>
                <div className="mt-3">
                  <SocialNetworkButtons
                    items={consultSocial}
                    label={`Redes de ${area.name}`}
                  />
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        {gestiones.length > 0 ? (
          <section className="mt-10 sm:mt-14" aria-label="Destacados del área">
            <p className="kicker">Destacados</p>
            <ul className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
              {gestiones.map((item) => (
                <li key={item.id}>
                  <DestacadoCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10 sm:mt-14" aria-labelledby="area-tramites">
          <p className="kicker">Servicios</p>
          <h2
            id="area-tramites"
            className="mt-2 text-2xl font-black tracking-tight text-brand-navy"
          >
            Programas y trámites
          </h2>
          {tramites.length > 0 ? (
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tramites.map((tramite) => (
                <li key={tramite.slug} className="min-w-0">
                  <TramitePosterCard tramite={tramite} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mt-4 max-w-2xl text-fg-muted">
                Todavía no hay trámites disponibles. Consultá en{" "}
                <Link className="font-bold text-accent-warm" href="/contacto">
                  sede
                </Link>{" "}
                o por teléfono.
              </p>
              <Link
                href="/tramites"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[6px] bg-accent px-5 font-bold text-white hover:bg-accent-warm"
              >
                Ir a Programas y trámites
              </Link>
            </>
          )}
        </section>

        {social.length > 0 ? (
          <section className="mt-10 sm:mt-14" aria-labelledby="area-redes">
            <p className="kicker">Redes</p>
            <h2
              id="area-redes"
              className="mt-2 text-2xl font-black tracking-tight text-brand-navy"
            >
              Redes del área
            </h2>
            <div className="mt-4">
              <SocialLinks items={social} label={`Redes de ${area.name}`} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
