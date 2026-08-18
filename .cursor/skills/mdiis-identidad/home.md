# Home (`/`) — próximamente + inauguración Infancias

La home **no** es el sitio institucional completo del PDF. El maquetado MDIIS (`MAQUETEADO WEB MDIIS.pdf`) aporta lengua visual (Antenna, aire, blobs, color contenido). Festipeques aporta gráficos de la única sección viva. El job de `/` es uno solo: **avisar que el sitio oficial viene, e inaugurar el Mes de las Infancias.**

## Restricciones duras

- **No tocar el navbar** ([`components/Header.tsx`](../../../components/Header.tsx)).
- **Una sola pantalla, sin scroll.** `100svh`, `overflow: hidden` (ya existe `body:has([data-home-screen])`). Nada debajo del fold.
- **Mobile-first.** La mayoría de las visitas son celular. Diseñar primero a ~360×800 (y 320 de piso), después desktop. Si algo no entra en el teléfono sin scroll, no va.
- Footer de home sigue oculto (`ConditionalFooter`).
- No armar Agenda Social, bio, mapa de oficinas ni franja PAN/TECHO/TRABAJO. Eso es el sitio futuro, no este lanzamiento.
- No reescribir `/mes-de-las-infancias`.

## Qué tiene que decir (en este orden de importancia)

1. **Próximamente** página oficial del Ministerio de Desarrollo, Igualdad e Integración Social.
2. **Inauguración:** la única sección activa hoy es el Mes de las Infancias / Festi Peques.
3. Un **botón/CTA claro** que lleve a `/mes-de-las-infancias` (`infancias.teaser.ctaHref`).

Copy base (ajustar, no inventar otro ministerio):

- Eyebrow: “Próximamente página oficial del”
- Nombre: `site.fullName`
- Provincia: `site.province`
- CTA: “Conocé Festi Peques” / “Entrar al Mes de las Infancias”

## Enfoque visual

- Pantalla completa. El hero es la tesis: ministerio en construcción + puerta de entrada a la campaña.
- Identidad institucional en el texto (Antenna, nombre del ministerio, tono de “próximamente”).
- Identidad Festipeques en el gancho de inauguración: logo, mascota(s), cinta Infancias cuidadas, color de campaña, botón con peso gráfico. Recursos en `public/festipeques/` y, si hace falta el pack crudo, `RECURSOS FESTIPEQUES 2026/` en la raíz.
- El CTA tiene que verse como inauguración, no como un link más: grande, obvio, con gráfico de campaña.
- Fotos de territorio (`/slides/` o fondo riojano) pueden ir de fondo; el primer plano es el mensaje + el botón.

## Mobile (prioridad)

La composición se define en el teléfono, no se “achica” un desktop.

- Contar el header fijo: el contenido útil vive en el espacio bajo la barra, con `pt` suficiente y `100svh` (no `100vh` a secas).
- En el fold móvil tienen que leerse sí o sí: “próximamente…”, el nombre del ministerio (puede ir más chico) y el **CTA a Infancias**. Si hay que recortar, se recortan gráficos, no el botón ni el mensaje.
- CTA al alcance del pulgar (mitad inferior), mínimo ~44×44 px, texto del botón completo (no icon-only).
- Una mascota o el logo, no el grupo entero si aprieta. `grupal.webp` es para desktop o un recorte.
- Tipografía: Antenna legible; no More Sugar en párrafos. Tamaño mínimo de cuerpo ~14px.
- Probar 320, 375 y 390 de ancho, y altura chica (Safari iOS con barra). Nada de scroll, nada de texto cortado, nada de CTA tapado por el navbar o el home indicator.
- `prefers-reduced-motion`. Hover no es el canal principal: el tap tiene que bastar.

## Código de partida

- [`components/HomeScreen.tsx`](../../../components/HomeScreen.tsx) — hoy: slider + teaser + tarjeta. Se puede rediseñar por completo **dentro** de esta pantalla.
- [`components/InfanciasTeaser.tsx`](../../../components/InfanciasTeaser.tsx) — el CTA actual; fortalecerlo, no esconderlo.

## No hacer

- Scroll, segunda sección, footer en home.
- Layout desktop-first que en el celular esconda el CTA o pida scroll.
- Nav 2021 de cuatro ítems.
- Tratar la home como landing larga de F.E.S. (eso ya está en `/mes-de-las-infancias`).
- Dejar el “próximamente” como único mensaje, sin puerta a Infancias.
