---
name: mdiis-identidad
description: Aplica la identidad visual del Ministerio de Desarrollo, Igualdad e Integración Social (MDIIS) de La Rioja en el sitio oficial (v2). Usar al diseñar o editar home, header, footer, trámites, áreas, tipografías o CSS.
---

# Identidad MDIIS — sitio oficial

Leer [tokens.md](tokens.md) antes de tocar color, tipo o assets.
Si el trabajo es la **página principal (`/`)**, leer también [home.md](home.md).

## Tesis

Sitio **oficial de trámites y áreas**, no un teaser ni una campaña. La gente entra a encontrar un programa o trámite y saber cómo acceder.

- **Home:** “Estamos para acompañarte” — búsqueda y atajos por necesidad, no por organigrama.
- **Chrome:** header con escudo, wordmark y menú (Inicio, Programas y trámites, Áreas, Contacto). Footer visible en todas las páginas.
- **Campaña Festipeques / Mes de las Infancias:** no está en v2. Si vuelve, entra como área o trámite, no como skin.

El PDF MDIIS y `recursos/01-Manual_Gestion_Gobierno.pdf` son lengua visual. No clonar el layout 2021 (`INSTITUCIONAL | MINISTERIO | SECRETARÍAS | CONTACTOS ÚTILES`).

## Tipografía

- Ford Antenna (`font-sans`): 300–900 en `fonts/antenna/`.
- Prohibido: Fredoka, Baloo, Inter, Georgia “AI default”, More Sugar, Burger Free.

## Header y footer

- Escudo `/logo-gob-rioja.svg`, wordmark `/ministerio.svg`, barra verde `#4caf50`.
- Footer carbón `#3a3a3a`, contacto y redes de [`content/site.ts`](../../../content/site.ts).

## No hacer

- Inventar requisitos, cifras, sedes, programas o autoridades de área.
- Poner titular de cada secretaría (no se publican por ahora).
- Morado genérico, cream+serif, carousel como vía principal, 3D en home.
- Commitear `recursos/` ni PDFs de marca.
