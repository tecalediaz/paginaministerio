# Campaña Festipeques — `/mes-de-las-infancias`

Ya implementada. No rehacerla al diseñar la home. Solo tocar si el pedido es esta ruta o el teaser.

## Unión

**Header ministerio. Debajo, la página es Festipeques. El mes es el marco; F.E.S. es un programa, no toda la página.**

## Layout (ya construido)

1. Hero viewport: `hero-parque.webp` + logo `logo.webp` + mascotas `grupal.webp` + titular “El Estado presente junto a las infancias”.
2. Franja slogan Antenna Black: `EDUCACIÓN · JUEGO · CUIDADO + COMUNIDAD` (CUIDADO en rosa campaña).
3. Cifras del ministerio (11.223 PAR / 2.038 F.E.S. / 928 EPI / 26 espacios) — Antenna, no display lúdica.
4. Subsecretaría de Niñez + pilares F.E.S. y EPI — icono lineal + título.
5. Marco constitucional — caja gris, borde navy (compromiso del ministerio, no solo F.E.S.).
6. Programas y recursos (PAR Escuela, Línea 102, Nueva Vida, agenda Festi Peques).
7. Escala F.E.S. vs EPI + pin.
8. Cita de cierre + footer visible.

Contenido canónico: [`content/infancias.ts`](../../../content/infancias.ts). Fuente: `mesinfancias.pdf`. No inventar programas, sedes ni cifras. Hogar Niño Alcalde queda fuera (información en revisión). Fechas Festi Peques confirmadas en el PDF: 23/08 Sur, 29/08 Este, 30/08 Norte.

## Reglas

- Display (More Sugar / Burger Free) solo en hero, fajas y badges.
- Una mascota por sección, de adorno.
- Sunburst solo en hero o fajas cortas, nunca detrás de un párrafo.
- Scope CSS de campaña: `[data-festipeques]`.
- Mobile-first también acá: columnas a una en celular, mascotas que no tapen texto, CTA/footer usables con el pulgar.
