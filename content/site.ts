export const site = {
  shortName: "Desarrollo Social",
  fullName:
    "Ministerio de Desarrollo, Igualdad e Integración Social",
  province: "Provincia de La Rioja",
  tagline: "Trabajamos por el bienestar y el progreso de La Rioja",
  nav: [
    { label: "Infancias cuidadas", href: "/mes-de-las-infancias" },
  ],
  home: {
    headline: "Este agosto, las infancias son protagonistas",
    kicker: "Próximamente",
    card: {
      eyebrow: "Página oficial del",
      title: "Página oficial de Desarrollo Social",
      description:
        "Estamos preparando el nuevo sitio del Ministerio de Desarrollo, Igualdad e Integración Social de la Provincia de La Rioja.",
    },
    inaugurationKicker: "Única sección activa",
    inauguration: "Mes de las Infancias / Festi Peques",
    ctaCaption: "Única sección publicada",
    cta: "Entrar al Mes de las Infancias",
    slides: [
      {
        src: "/slides/DSC_0621.jpg",
        alt: "Actividad del Ministerio de Desarrollo Social en La Rioja",
      },
      {
        src: "/slides/DSC_0676.JPG",
        alt: "Comunidad y trabajo territorial en la provincia",
      },
      {
        src: "/slides/IMG_3326.jpg",
        alt: "Jornada institucional del Ministerio",
      },
      {
        src: "/slides/PRD00598.jpg",
        alt: "Encuentro con vecinas y vecinos",
      },
      {
        src: "/slides/PRD00673.jpg",
        alt: "Programa social en La Rioja",
      },
    ],
    infanciasTile: {
      href: "/mes-de-las-infancias#agenda",
      label: "Agosto",
      title: "Mes de las Infancias",
      cta: "Mes de las Infancias",
    },
  },
  slogan: [
    { text: "PAN", accent: false },
    { text: "TECHO", accent: false },
    { text: "TRABAJO", accent: true },
    { text: "+ COMUNIDAD", accent: false },
  ],
  agenda: {
    title: "Agenda Social",
    featured: {
      src: "/home/agenda-emeli.jpg",
      alt: "Recorrido por el asentamiento Emeli Bestani",
      caption:
        "Recorrimos el asentamiento Emeli Bestani donde se están realizando las primeras obras, del #PlanAngelelli",
    },
    video: {
      src: "/home/agenda-video.jpg",
      alt: "Registro de feria y trabajo comunitario",
      href: "https://www.instagram.com/desarrollolr/?hl=es",
    },
  },
  minister: {
    name: "Gabriela Pedrali",
    photo: "/home/gabriela-pedrali.png",
    bio: "Especialista en Políticas Públicas, Comunicación y Gestión Cultural. Diplomada en Gestión Municipal. Practitioner en PNL. Fue asesora en el Senado de la Nación Argentina; secretaria de Comunicación Pública de la Municipalidad de La Rioja; presidenta de la Agencia Provincial de Cultura de La Rioja; gerenta de Acción Federal en el Instituto Nacional de Cine y Artes Visuales (INCAA); directora general de la Casa de la Provincia de La Rioja en Buenos Aires. También se desempeñó como secretaria de Desarrollo Social y Humano de la Municipalidad de La Rioja y como directora del Albergue de niños “Niño Alcalde”.",
  },
  contact: {
    address: "Av. Alem y Av. Los Caudillos",
    hours: "8:00–13:00 | 17:00–21:00",
    phone: "+54 0380 445-3156",
    email: "consultas@desarrollosocial.larioja.gob.ar",
    whatsappHref: "https://wa.me/543804453156",
  },
  offices: {
    title: "Nuestras oficinas (Sede Central)",
    mapSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=-66.872%2C-29.425%2C-66.840%2C-29.400&layer=mapnik&marker=-29.4135%2C-66.8563",
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
