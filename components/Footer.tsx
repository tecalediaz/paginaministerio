import Image from "next/image";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#ececec] text-brand-ink">
      <div className="section-shell grid grid-cols-1 justify-items-center gap-8 py-10 sm:grid-cols-3 sm:justify-items-stretch">
        <p className="max-w-[18rem] self-center text-center text-sm font-medium leading-snug text-brand-gray sm:justify-self-start sm:text-left">
          {site.tagline}
        </p>

        <Image
          src="/LA_RIOJA_Gobierno.png"
          alt="Gobierno de La Rioja"
          width={749}
          height={609}
          className="mx-auto h-16 w-auto object-contain sm:h-20"
        />

        <div className="flex flex-col items-center gap-2 sm:justify-self-end">
          <p className="text-sm font-semibold tracking-wide text-brand-ink">
            ¡Seguinos!
          </p>
          <SocialLinks className="social-uiverse--footer" />
        </div>
      </div>
    </footer>
  );
}
