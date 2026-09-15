import Link from "next/link";
import { NeedExplorer } from "@/components/NeedExplorer";
import { TramiteCard } from "@/components/TramiteCard";
import { areas } from "@/content/areas";
import { site } from "@/content/site";
import { featuredTramites } from "@/content/tramites";

export default function Home() {
  const featured = featuredTramites();

  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
          <div>
            <p className="kicker">Página oficial</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-brand-navy sm:text-6xl">
              ¿Qué necesitás?
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {site.fullName}. Encontrá el trámite o el área y cómo acceder:
              requisitos vigentes, sede y contacto.
            </p>
          </div>
          <p className="text-sm text-fg-muted lg:text-right">
            {site.minister.title}
            <br />
            <span className="text-base font-bold text-fg">{site.minister.name}</span>
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="flex overflow-x-auto">
          {site.slogan.map((item, index) => (
            <Link
              key={item.text}
              href={`/tramites?need=${item.need}`}
              className={`flex min-h-14 min-w-[50%] flex-1 items-center justify-center border-r border-white/20 px-4 text-sm font-black tracking-[0.18em] sm:min-w-0 sm:text-base ${
                index === 2 ? "bg-brand-red text-white" : "bg-bg-deep text-white"
              }`}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </section>

      <section className="shell py-10 sm:py-14">
        <NeedExplorer />
      </section>

      <section className="bg-bg-soft">
        <div className="shell py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="kicker">Acceso rápido</p>
              <h2 className="mt-2 text-3xl font-black text-brand-navy">
                Trámites destacados
              </h2>
            </div>
            <Link href="/tramites" className="hidden font-bold text-accent-warm sm:inline">
              Ver todos
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featured.map((tramite) => (
              <TramiteCard key={tramite.slug} tramite={tramite} />
            ))}
          </div>
          <Link href="/tramites" className="mt-6 inline-flex min-h-11 items-center font-bold text-accent-warm sm:hidden">
            Ver todos los trámites
          </Link>
        </div>
      </section>

      <section className="shell py-10 sm:py-14">
        <p className="kicker">Organigrama de servicio</p>
        <h2 className="mt-2 text-3xl font-black text-brand-navy">Áreas</h2>
        <p className="mt-3 max-w-2xl text-fg-muted">
          El ministerio se organiza en secretarías, subsecretarías, direcciones y
          consejos. La ficha de cada área dice a quién atiende y cómo consultar.
        </p>
        <ul className="mt-8 columns-1 gap-x-10 sm:columns-2">
          {areas.map((area) => (
            <li key={area.slug} className="mb-3 break-inside-avoid">
              <Link href={`/areas/${area.slug}`} className="font-semibold hover:text-accent-warm">
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/areas" className="mt-4 inline-flex min-h-11 items-center font-bold text-accent-warm">
          Directorio de áreas
        </Link>
      </section>

      <section className="border-t border-line bg-white">
        <div className="shell grid gap-8 py-10 sm:grid-cols-3 sm:py-14">
          <div>
            <p className="kicker">Sede</p>
            <p className="mt-3 text-lg font-bold">{site.contact.address}</p>
            <p className="text-fg-muted">{site.contact.city}</p>
          </div>
          <div>
            <p className="kicker">Horario</p>
            <p className="mt-3 text-lg font-bold">{site.contact.hours}</p>
          </div>
          <div>
            <p className="kicker">Contacto</p>
            <p className="mt-3">
              <a className="text-lg font-bold text-accent-warm" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
            </p>
            <Link href="/contacto" className="mt-2 inline-flex min-h-11 items-center font-bold">
              Cómo llegar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
