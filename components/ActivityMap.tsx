import { infancias } from "@/content/infancias";

/**
 * Mapa plantilla con iframe de OpenStreetMap centrado en La Rioja
 * y listado de puntos mock. Reemplazar por mapa interactivo / CMS.
 */
export function ActivityMap() {
  const bbox = "-69.2,-30.4,-65.8,-27.8";
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=-29.4135%2C-66.8563`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="overflow-hidden rounded-sm border border-line bg-bg-soft shadow-[var(--shadow-soft)]">
        <iframe
          title="Mapa de actividades — La Rioja (plantilla)"
          src={mapSrc}
          className="h-[320px] w-full border-0 sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <ul className="space-y-4">
        {infancias.mapPoints.map((point) => (
          <li
            key={point.id}
            className="border-b border-line pb-4 last:border-b-0 last:pb-0"
          >
            <p className="font-display text-lg font-semibold text-fg">
              {point.name}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{point.description}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-fg-muted/70">
              {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
