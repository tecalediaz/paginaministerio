# Campaña Festipeques — `/mes-de-las-infancias`

Ya implementada. No rehacerla al diseñar la home. Solo tocar si el pedido es esta ruta o el teaser.

## Unión

**Header ministerio. Debajo, la página es Festipeques. Texto largo = F.E.S. en Antenna.**

## Layout (ya construido)

1. Hero viewport: `hero-parque.webp` + logo `logo.webp` + mascotas `grupal.webp` + titular “El Estado presente en cada aula”.
2. Franja slogan Antenna Black: `EDUCACIÓN · JUEGO · CUIDADO + COMUNIDAD` (CUIDADO en rosa campaña).
3. Números F.E.S. (2.038 / 119 / 119 / 21) — Antenna, no display lúdica.
4. Qué es F.E.S. / misión / visión — icono lineal + título.
5. Marco constitucional — caja gris, borde navy.
6. Actividades reales (Lengua y Matemática, lectura, escarapela, títeres).
7. Territorio Capital vs Interior + pin.
8. Cita de cierre + footer visible.

Contenido canónico: [`content/infancias.ts`](../../../content/infancias.ts). No inventar fechas de flyers (17 ago / parques) salvo confirmación.

## Reglas

- Display (More Sugar / Burger Free) solo en hero, fajas y badges.
- Una mascota por sección, de adorno.
- Sunburst solo en hero o fajas cortas, nunca detrás de un párrafo.
- Scope CSS de campaña: `[data-festipeques]`.
- Mobile-first también acá: columnas a una en celular, mascotas que no tapen texto, CTA/footer usables con el pulgar.
