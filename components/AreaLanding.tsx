import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DestacadosCarousel } from "@/components/DestacadosCarousel";
import { LinkedText } from "@/components/LinkedText";
import { SedeHours } from "@/components/SedeHours";
import {
  SocialLinks,
  SocialNetworkButtons,
} from "@/components/SocialLinks";
import { TramitePosterCard } from "@/components/TramiteCard";
import { site } from "@/content/site";
import type { PublicAreaFaq } from "@/lib/area-faqs";
import type { PublicAreaView, PublicSedeView } from "@/lib/public-area";
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
        sizes="(min-width: 1024px) 40rem, 100vw"
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
  return (
    <article className="overflow-hidden rounded-xl bg-white">
      <div className="relative aspect-[3/4] overflow-hidden">
        <DestacadoMedia src={item.imageUrl} alt={item.imageAlt || item.title} />
      </div>
      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
        <h3 className="text-lg font-bold text-pretty text-brand-navy sm:text-xl">
          {item.title}
        </h3>
        {item.summary ? (
          <LinkedText
            text={item.summary}
            className="mt-2 text-sm leading-relaxed text-fg-muted"
          />
        ) : null}
      </div>
    </article>
  );
}

function AreaFaqs({ items }: { items: PublicAreaFaq[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6" aria-labelledby="area-faqs">
      <p
        id="area-faqs"
        className="text-xs font-extrabold tracking-[0.16em] text-fg-muted uppercase"
      >
        Preguntas frecuentes
      </p>
      <div className="mt-3 divide-y divide-line border-t border-b border-line">
        {items.map((item) => (
          <details key={item.id} className="py-3">
            <summary className="cursor-pointer font-bold text-brand-navy">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-fg-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function AreaCover({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("/") && !src.startsWith("//")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1120px) 1120px, calc(100vw - 2rem)"
        className="object-cover object-center"
      />
    );
  }

  return (
    // Remote catalog cover (R2). Hosts are not known until an area publishes one.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  );
}

function AreaBanner({ area }: { area: PublicAreaView }) {
  return (
    <figure className="area-banner relative isolate overflow-hidden rounded-xl bg-bg-deep">
      {area.coverUrl ? <AreaCover src={area.coverUrl} alt={area.name} /> : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-bg-deep/45 to-bg-deep/15"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-5 text-fg-on-dark sm:px-8 sm:py-8">
        <p className="kicker">
          {area.kind} · {area.needLabel}
        </p>
        <h1 id="area-title" className="area-banner__title">
          {area.name}
        </h1>
      </div>
    </figure>
  );
}

function SedeBlock({
  sede,
  areaName,
  first,
}: {
  sede: PublicSedeView;
  areaName: string;
  first: boolean;
}) {
  return (
    <div>
      <p className={`${first ? "mt-5" : "mt-6"} font-bold text-brand-navy`}>{sede.address}</p>
      <p className="text-fg-muted">{site.contact.city}</p>
      {sede.hours ? (
        <div className="mt-4">
          <p className="text-xs font-extrabold tracking-[0.16em] text-fg-muted uppercase">
            Horario
          </p>
          <SedeHours hours={sede.hours} />
        </div>
      ) : null}
      {sede.mapEmbed ? (
        <div className="mt-6">
          <iframe
            title={`Mapa de la sede de ${sede.name || areaName}`}
            src={sede.mapEmbed}
            loading="lazy"
            className="h-48 w-full border border-line"
          />
          {sede.mapOpen ? (
            <a
              className="mt-3 inline-flex min-h-11 items-center text-sm font-bold"
              href={sede.mapOpen}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir mapa
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function AreaLanding({
  area,
  gestiones,
  tramites,
  faqs,
}: {
  area: PublicAreaView;
  gestiones: Gestion[];
  tramites: Tramite[];
  faqs: PublicAreaFaq[];
}) {
  const showAbout = Boolean(area.summary) || gestiones.length > 0;
  const showAside = area.sedes.length > 0 || area.social.length > 0 || faqs.length > 0;

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
          <AreaBanner area={area} />
        </section>

        <div className="mt-8 grid gap-x-8 gap-y-10 sm:gap-y-14 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:items-start lg:gap-x-12">
          {showAbout ? (
          <div className="flex min-w-0 flex-col gap-10 sm:gap-14 lg:col-start-1 lg:row-start-1">
            {area.summary ? (
              <section aria-label="Información del área">
                <p className="kicker">El área</p>
                <p className="area-lead mt-4">{area.summary}</p>
              </section>
            ) : null}

            {gestiones.length > 0 ? (
              <section aria-label="Destacados del área">
                <p className="kicker">Destacados</p>
                <DestacadosCarousel>
                  {gestiones.map((item) => (
                    <DestacadoCard key={item.id} item={item} />
                  ))}
                </DestacadosCarousel>
              </section>
            ) : null}
          </div>
          ) : null}

          <section className="lg:col-span-2" aria-labelledby="area-tramites">
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

          {area.social.length > 0 ? (
            <section className="lg:col-span-2" aria-labelledby="area-redes">
              <p className="kicker">Redes</p>
              <h2
                id="area-redes"
                className="mt-2 text-2xl font-black tracking-tight text-brand-navy"
              >
                Redes del área
              </h2>
              <div className="mt-4">
                <SocialLinks items={area.social} label={`Redes de ${area.name}`} />
              </div>
            </section>
          ) : null}

          {showAside ? (
          <aside className="area-consult h-fit lg:col-start-2 lg:row-start-1 bg-white px-5 py-6 sm:px-6 sm:py-7">
            <p className="kicker">Información</p>
            {area.sedes.map((sede, index) => (
              <SedeBlock
                key={`${sede.address}-${index}`}
                sede={sede}
                areaName={area.name}
                first={index === 0}
              />
            ))}
            {area.social.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-extrabold tracking-[0.16em] text-fg-muted uppercase">
                  Redes
                </p>
                <div className="mt-3">
                  <SocialNetworkButtons
                    items={area.social}
                    label={`Redes de ${area.name}`}
                  />
                </div>
              </div>
            ) : null}
            <AreaFaqs items={faqs} />
          </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
