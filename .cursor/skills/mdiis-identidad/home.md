# Home (`/`) — institucional: próximamente + puerta a Infancias

La home **no** es el sitio institucional completo del PDF **ni** un landing de Festi Peques. El maquetado MDIIS aporta la lengua: Antenna, aire, blobs suaves, carbón/verde/rojo. Festipeques es la **única sección viva**, y en esta pantalla aparece como credencial/pase, no como skin.

Job de `/`: **avisar que el sitio oficial viene, e inaugurar Mes de las Infancias.**

## Restricciones duras

- **No tocar el navbar** ([`components/Header.tsx`](../../../components/Header.tsx)).
- **Una sola pantalla, sin scroll.** `100svh`, `overflow: hidden`. Nada debajo del fold.
- **Mobile-first.** ~360×800 (piso 320), después desktop.
- Footer de home oculto (`ConditionalFooter`).
- No armar Agenda Social, bio, mapa de oficinas ni franja PAN/TECHO/TRABAJO.
- No reescribir `/mes-de-las-infancias`.

## Qué tiene que decir

1. **Próximamente** página oficial del Ministerio de Desarrollo, Igualdad e Integración Social.
2. La única sección publicada hoy es el **Mes de las Infancias**.
3. Un **CTA institucional** a `/mes-de-las-infancias` (`infancias.teaser.ctaHref`).

Copy (ajustar, no inventar otro ministerio):

- Kicker: “Próximamente”
- Lead: “Página oficial del”
- Nombre: `site.fullName`
- Provincia: `site.province`
- CTA: “Entrar al Mes de las Infancias” (no “Conocé Festi Peques”, no botón de feria)

## Enfoque visual

- Fondo institucional `#f9f9f9`. Blobs menta/amarillo del maquetado, no sunburst de campaña.
- Aviso: tipografía Antenna, kicker rojo `#e30613` o verde `#4caf50`, título carbón. Sin pastillas amarillas, sin logo Festi en el bloque de texto.
- Botón: rectángulo bajo (radio ~6px), carbón o verde institucional, Antenna bold, tap ≥44px, al pulgar. Sin 3D candy, sin mascota asomando, sin faja violeta.
- Credencial 3D: el único objeto de campaña. Pase emitido por el ministerio (barra institucional + evento Festi en la cara). Cordón carbón/verde, no carnaval.
- Fotos de territorio (`/slides/`) pueden ir en máscara blob, discretas.

## Mobile

- Se leen sí o sí: “próximamente”, el nombre del ministerio y el CTA. Si aprieta, se recorta la credencial.
- `prefers-reduced-motion`: credencial estática; el tap del botón basta.

## No hacer

- Skin Festi Peques en aviso, fondo o botón.
- Scroll, segunda sección, footer en home.
- Nav 2021 de cuatro ítems.
- Tratar `/` como la landing de F.E.S.
