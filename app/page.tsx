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
              <p className="kicker">Sede</p>
              <p className="mt-3 text-lg font-bold">{site.contact.address}</p>
              <p className="text-fg-muted">{site.contact.city}</p>
            </div>
            <div>
              <p className="kicker">Horario</p>
              <SedeHours hours={site.contact.hours} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
