import Image from "next/image";
import { AreaIndex } from "@/components/AreaIndex";
import { GestionStories } from "@/components/GestionStories";
import { NeedExplorer } from "@/components/NeedExplorer";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { SedeHours } from "@/components/SedeHours";
import { SloganStrip } from "@/components/SloganStrip";
import { sedePhoto } from "@/content/home-photos";
import { site } from "@/content/site";
import { listPublishedGestiones } from "@/lib/gestiones";
import { listPublishedTramites } from "@/lib/tramites";

export const revalidate = 120;

export default async function Home() {
  const [gestiones, tramites] = await Promise.all([
    listPublishedGestiones(),
    listPublishedTramites(),
  ]);

  return (
    <div>
      <section className="home-hero border-b border-line">
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">Estamos para acompañarte</h1>
            <p className="home-hero__lead">
              {site.fullName}. Encontrá el trámite o el área y cómo acceder:
              requisitos vigentes, sede y contacto.
            </p>
            <div className="home-hero__foot">
              <a href="#consulta" className="home-hero__cta">
                Buscar trámite
              </a>
            </div>
          </div>
          <div className="home-hero__photo">
            <Image
              src="/home/hero-turco.png"
              alt="El ministro Alfredo Menem en territorio, junto a vecinos y niñeces de La Rioja."
              fill
              priority
              sizes="100vw"
              className="home-hero__img object-cover"
            />
          </div>
        </div>
      </section>

      <SloganStrip />

      <section className="shell py-10 sm:py-14">
        <NeedExplorer tramites={tramites} />
      </section>

      <section className="shell py-10 sm:py-14">
        <AreaIndex />
      </section>

      <GestionStories items={gestiones} />

      <section className="border-t border-line bg-white">
        <div className="shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <PlaceholderPhoto
            photo={sedePhoto}
            className="aspect-[16/10]"
            sizes="(min-width: 1024px) 620px, 100vw"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="kicker">Sede central</p>
              <p className="mt-3 text-lg font-bold">{site.contact.address}</p>
              <p className="text-fg-muted">{site.contact.city}</p>
            </div>
            <div>
              <p className="kicker">Horario de atención</p>
              <SedeHours hours={site.contact.hours} />
              <p className="mt-2 text-sm text-fg-muted">Atención al público en la sede central.</p>
            </div>
            <a
              href={site.contact.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-accent px-5 font-bold text-white transition-colors hover:bg-accent-warm sm:col-span-2 lg:col-span-1 lg:justify-self-start"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Cómo llegar · Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
