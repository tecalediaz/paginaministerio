import Image from "next/image";
import { FestiLanyardSlot } from "@/components/FestiLanyardSlot";
import { InfanciasTeaser } from "@/components/InfanciasTeaser";
import { site } from "@/content/site";

export function HomeScreen() {
  return (
    <div data-home-screen className="home-launch">
      <div className="home-launch__blobs" aria-hidden>
        <span className="home-launch__blob home-launch__blob--mint" />
        <span className="home-launch__blob home-launch__blob--yellow" />
      </div>
      <div className="home-launch__photo" aria-hidden>
        <Image
          src={site.home.slides[0].src}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 0px, 42vw"
          className="object-cover"
        />
      </div>

      <div className="home-launch__inner">
        <div className="home-launch__copy">
          <Image
            src="/LA_RIOJA_Gobierno.png"
            alt="Gobierno de La Rioja"
            width={749}
            height={609}
            className="home-launch__seal"
          />
          <p className="home-launch__kicker">{site.home.kicker}</p>
          <p className="home-launch__lead">{site.home.card.eyebrow}</p>
          <h1 className="home-launch__title">{site.fullName}</h1>
        </div>

        <div className="home-launch__art">
          <FestiLanyardSlot />
        </div>

        <div className="home-launch__cta">
          <InfanciasTeaser />
        </div>
      </div>
    </div>
  );
}
