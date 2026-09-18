import { GestionCarousel } from "@/components/GestionCarousel";
import type { Gestion } from "@/lib/gestiones";

export function GestionStories({ items }: { items: Gestion[] }) {
  const slides = items.slice(0, 5);
  if (slides.length === 0) return null;

  return (
    <section className="bg-bg-soft" aria-label="Publicaciones de gestión">
      <div className="shell py-10 sm:py-14">
        <p className="kicker">Destacados</p>
        <div className="mt-4 sm:mt-5">
          <GestionCarousel items={slides} />
        </div>
      </div>
    </section>
  );
}
