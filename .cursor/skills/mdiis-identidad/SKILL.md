---
name: mdiis-identidad
description: Aplica la identidad visual del Ministerio de Desarrollo, Igualdad e Integración Social (MDIIS) de La Rioja y la capa Festipeques 2026. Usar al diseñar o editar la home, el header, el footer, /mes-de-las-infancias, el teaser, tipografías, CSS, o al mencionar MDIIS, maquetado web, F.E.S. o Festipeques.
---

# Identidad MDIIS + Festipeques

Leer [tokens.md](tokens.md) antes de tocar color, tipo o assets.
Si el trabajo es la **página principal (`/`)**, leer también [home.md](home.md).
Si el trabajo es **Mes de las Infancias**, leer [campana.md](campana.md).

## Fuentes en la raíz del proyecto

El diseñador suele pegar el zip acá (no van a git). **Abrirlos y mirarlos** antes de diseñar:

- `MAQUETEADO WEB MDIIS.pdf` — lengua visual institucional (no clonar la home del PDF en v1).
- `mes_de_las_infancias*.pdf` — contenido F.E.S. (ya volcado en `content/infancias.ts`).
- `RECURSOS FESTIPEQUES 2026/` — pack crudo de campaña. En web usar `public/festipeques/`, no commitear el pack.

Si un PDF no está con ese nombre, buscar `*.pdf` en la raíz.

## Tesis

**El header no se toca.** La home es **una sola pantalla, sin scroll**, **mobile-first** (la mayoría entra por el celular): “próximamente página oficial” + inauguración de la única sección activa (Mes de las Infancias / Festi Peques) con CTA a `/mes-de-las-infancias`. Esa landing ya está; no rehacerla. El texto institucional va en Ford Antenna. Los gráficos de inauguración sí son Festipeques.

El PDF MDIIS es lengua visual de referencia, no un layout a clonar en `/`.


## Tipografía

- Cuerpo, nav, números, legal: Ford Antenna (`font-sans` / `font-display`). Pesos 300–900 en `fonts/antenna/`.
- Campaña (solo infancias): More Sugar (`font-campaign`), Burger Free (`font-banner`).
- Franjas-eslogan: Antenna Black + tracking. Si no hay Antenna Italic/Condensed, no fingir cursiva.
- Prohibido: Fredoka, Baloo, Inter, Georgia “AI default”.

## Header y footer (no tocar la lógica)

- Header vivo: [`components/Header.tsx`](../../../components/Header.tsx) — escudo `/logo-gob-rioja.svg`, wordmark `/ministerio.svg`, redes, barra verde `#4caf50`.
- No recrear `INSTITUCIONAL | MINISTERIO | SECRETARÍAS | CONTACTOS ÚTILES` del PDF 2021.
- Footer: carbón `#3a3a3a`, contacto y redes de [`content/site.ts`](../../../content/site.ts). En home el footer está oculto a propósito (`ConditionalFooter`).

## No hacer

- Morado genérico, cream+serif, broadsheet.
- Three.js / Rapier / lanyard salvo pedido explícito.
- Commitear `RECURSOS FESTIPEQUES 2026/`. Usar `public/festipeques/`.
- Inventar agenda, sedes o cifras. Home: [`content/site.ts`](../../../content/site.ts). Infancias: [`content/infancias.ts`](../../../content/infancias.ts).
