export const site = {
  shortName: "Desarrollo Social",
  fullName:
    "Ministerio de Desarrollo, Igualdad e Integración Social",
  province: "Provincia de La Rioja",
  tagline: "Programas, trámites y áreas para las riojanas y los riojanos",
  minister: {
    name: "Alfredo Menem",
    title: "Ministro",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Programas y trámites", href: "/tramites" },
    { label: "Áreas", href: "/areas" },
    { label: "Contacto", href: "/contacto" },
  ],
  slogan: [
    { text: "PAN", need: "alimentacion" },
    { text: "TECHO", need: "territorio" },
    { text: "TRABAJO", need: "trabajo" },
    { text: "+ COMUNIDAD", need: "infancias" },
  ],
  contact: {
    address: "Av. Alem y Av. Los Caudillos",
    city: "Ciudad de La Rioja",
    hours: "08:00–20:00",
    phone: "+54 0380 445-3156",
    phoneHref: "tel:+543804453156",
    email: "consultas@desarrollosocial.larioja.gob.ar",
    whatsappHref: "https://wa.me/543804453156",
    mapSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=-66.872%2C-29.425%2C-66.840%2C-29.400&layer=mapnik&marker=-29.4135%2C-66.8563",
    mapLink:
      "https://www.openstreetmap.org/?mlat=-29.4135&mlon=-66.8563#map=16/-29.4135/-66.8563",
  },
  social: [
    {
      id: "x",
      label: "X",
      href: "https://x.com/LrDesarrollo",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/ministeriodesarrollolr/",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/desarrollolr/?hl=es",
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@desarrollolr",
    },
  ],
} as const;

export const socialNetworkIds = [
  "instagram",
  "facebook",
  "x",
  "tiktok",
  "youtube",
] as const;

export type SocialId = (typeof socialNetworkIds)[number];

const HOURS_RANGE = /^(\d{1,2})(?::(\d{2}))?[–-](\d{1,2})(?::(\d{2}))?$/;

function padClock(hour: string, minute?: string) {
  return `${hour.padStart(2, "0")}:${minute ?? "00"}`;
}

export function contactHoursParts(hours: string) {
  const match = hours.match(HOURS_RANGE);
  if (!match) return null;
  return {
    from: padClock(match[1], match[2]),
    to: padClock(match[3], match[4]),
  };
}

export function formatContactHours(hours: string) {
  const parts = contactHoursParts(hours);
  if (!parts) return hours;
  return `${parts.from} a ${parts.to}`;
}

export type NavItem = (typeof site.nav)[number];
