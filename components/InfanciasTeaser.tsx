import Link from "next/link";
import { infancias } from "@/content/infancias";
import { site } from "@/content/site";

export function InfanciasTeaser() {
  return (
    <div className="home-cta-wrap">
      <Link
        href={infancias.teaser.ctaHref}
        className="home-cta"
        aria-label={`${site.home.cta}. ${site.home.inauguration}`}
      >
        {site.home.cta}
      </Link>
    </div>
  );
}
