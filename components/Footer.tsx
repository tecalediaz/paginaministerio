import { SocialLinks, WhatsAppIcon } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#ececec] text-brand-ink">
      <div className="section-shell flex flex-col items-center gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-lg font-medium italic text-brand-gray transition-colors hover:text-brand-red"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink text-white [&_svg]:fill-white">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          Contactanos
        </a>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[0.7rem] font-medium lowercase tracking-wide text-brand-gray">
            provincia que late
          </p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-gray">
            Gobierno de
          </p>
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-brand-red sm:text-3xl">
            La Rioja
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <p className="social-seguinos is-always">¡Seguinos!</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
