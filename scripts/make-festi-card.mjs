/**
 * Genera las texturas de la credencial 3D del home.
 *
 * Salidas:
 *   card-front.webp / card-back.webp  caras sueltas (fallback estático)
 *   card-atlas.webp                   atlas alineado a los UV de card.glb
 *   lanyard-strap.png                 cinta del cordón
 *
 * Los rectángulos UV de FRONT/BACK están medidos sobre card.glb
 * (scripts/measure-card-uv.mjs). Si se cambia el modelo, hay que remedirlos.
 */
import fs from "fs";
import path from "path";
import opentype from "opentype.js";
import sharp from "sharp";

const DEST = "public/festipeques";
const FW = 1080;
const FH = 1545;
const ATLAS = 2048;

const FRONT_UV = { x0: 0.0008521821, x1: 0.49889764, y0: 0.0042516, y1: 0.75483376 };
const BACK_UV = { x0: 0.5014492869, x1: 0.9999332428, y0: 0.0022884607, y1: 0.7571759820 };

const BODY = "#c5eaf8";
const BODY_DEEP = "#8fd0ee";
const BAND = "#23272b";
const INK = "#1c2024";
const NAVY = "#1e2a4a";
const RED = "#e52138";
const GREEN = "#41ab3f";
const YELLOW = "#fdc80a";
const MUTED = "#6b727c";
const LABEL = "#8b929c";
const HAIRLINE = "#c7ccd2";

const loadFont = (file) => opentype.parse(fs.readFileSync(`fonts/antenna/${file}`).buffer);

const fonts = {
  black: loadFont("FordAntenna-Black.ttf"),
  bold: loadFont("FordAntenna-Bold.ttf"),
  semi: loadFont("FordAntenna-Semibold.ttf"),
  medium: loadFont("FordAntenna-Medium.ttf"),
  regular: loadFont("FordAntenna-Regular.ttf"),
};

const n = (v) => {
  if (!Number.isFinite(v)) throw new Error("coordenada inválida en el trazado de texto");
  return Number(v.toFixed(2));
};

/** toPathData() de opentype 2.0 emite NaN con offsets grandes: serializamos a mano. */
function pathData(path) {
  return path.commands
    .map((c) => {
      switch (c.type) {
        case "M":
          return `M${n(c.x)} ${n(c.y)}`;
        case "L":
          return `L${n(c.x)} ${n(c.y)}`;
        case "Q":
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case "C":
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default:
          return "Z";
      }
    })
    .join("");
}

/** Convierte texto en trazos para no depender de fuentes del sistema. */
function outline(font, str, size, ls) {
  if (!ls) {
    return { d: pathData(font.getPath(str, 0, 0, size)), width: font.getAdvanceWidth(str, size) };
  }
  const chars = [...str];
  const ds = [];
  let x = 0;
  for (const ch of chars) {
    const d = pathData(font.getPath(ch, x, 0, size));
    if (d) ds.push(d);
    x += font.getAdvanceWidth(ch, size) + ls;
  }
  return { d: ds.join(" "), width: Math.max(0, x - ls) };
}

function measure(weight, str, size, ls = 0) {
  return outline(fonts[weight], str, size, ls).width;
}

function text(weight, str, { size, x, y, ls = 0, fill = INK, anchor = "start", opacity }) {
  const { d, width } = outline(fonts[weight], str, size, ls);
  const dx = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  const alpha = opacity === undefined ? "" : ` opacity="${opacity}"`;
  return `<path d="${d}" fill="${fill}"${alpha} transform="translate(${dx.toFixed(2)} ${y})"/>`;
}

/** Ondas finas de fondo, como el guilloche impreso de una credencial real. */
function guilloche({ x, y, w, h, lines = 16, color = GREEN, opacity = 0.075 }) {
  const out = [];
  for (let i = 0; i < lines; i++) {
    const cy = y + (h / (lines - 1)) * i;
    const amp = 16 + 10 * Math.sin(i * 0.9);
    const period = 210 + 26 * Math.cos(i * 0.6);
    const phase = i * 0.55;
    const pts = [];
    for (let px = x; px <= x + w; px += 12) {
      const py = cy + amp * Math.sin((px / period) * Math.PI * 2 + phase);
      pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    out.push(
      `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="1.1" opacity="${opacity}"/>`,
    );
  }
  return out.join("");
}

/** LCG para que el código de barras sea siempre el mismo. */
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
}

function barcode({ x, y, w, h, seed = 7, color = "#1a1d21" }) {
  const rand = seeded(seed);
  const bars = [];
  let px = x;
  while (px < x + w - 6) {
    const bw = 2 + Math.round(rand() * 5);
    if (px + bw > x + w) break;
    bars.push(`<rect x="${px}" y="${y}" width="${bw}" height="${h}" fill="${color}"/>`);
    px += bw + 2 + Math.round(rand() * 5);
  }
  return bars.join("");
}

/** Microtexto: ilegible al tamaño real, exactamente como en un documento. */
function microtext({ x, y, w, size = 9.5, fill = "#b2b8c0" }) {
  const unit = "INFANCIASCUIDADAS\u00b7";
  const unitW = measure("medium", unit, size, 0.35);
  const repeats = Math.ceil(w / unitW) + 1;
  const str = unit.repeat(repeats);
  const { d } = outline(fonts.medium, str, size, 0.35);
  return `<g clip-path="url(#microClip)"><path d="${d}" fill="${fill}" transform="translate(${x} ${y})"/></g><clipPath id="microClip"><rect x="${x}" y="${y - size}" width="${w}" height="${size * 1.5}"/></clipPath>`;
}

function labelledField(label, value, { x, y, valueSize = 30, valueWeight = "semi" }) {
  return [
    text("bold", label, { size: 15, x, y, ls: 3.6, fill: LABEL }),
    text(valueWeight, value, { size: valueSize, x, y: y + 40, fill: NAVY }),
  ].join("");
}

// MeshLine usa UV.x a lo largo de la tira y UV.y a lo ancho, así que la textura
// tiene que ser apaisada (texto de izquierda a derecha). Una tira vertical
// queda aplastada, espejada y con costuras al repetir.
async function writeLanyardStrap() {
  const STRAP_H = 128;
  const strapUnit = outline(fonts.bold, "INFANCIAS CUIDADAS \u00b7 ", 34, 6);
  const pad = 16;
  const STRAP_W = Math.max(256, Math.round(strapUnit.width + pad));
  const strapBaseline = Math.round(STRAP_H * 0.64);
  const strap = Buffer.from(`
<svg width="${STRAP_W}" height="${STRAP_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${STRAP_W}" height="${STRAP_H}" fill="${BAND}"/>
  <rect x="0" y="0" width="${STRAP_W}" height="7" fill="#15181b"/>
  <rect x="0" y="${STRAP_H - 7}" width="${STRAP_W}" height="7" fill="#15181b"/>
  <rect x="0" y="14" width="${STRAP_W}" height="10" fill="${GREEN}"/>
  <rect x="0" y="${STRAP_H - 24}" width="${STRAP_W}" height="10" fill="${RED}"/>
  <path d="${strapUnit.d}" fill="#eef1f4" opacity="0.92" transform="translate(${pad / 2} ${strapBaseline})"/>
</svg>`);
  await sharp(strap).png().toFile(path.join(DEST, "lanyard-strap.png"));
}

await writeLanyardStrap();
if (process.argv.includes("--strap-only")) {
  console.log("lanyard-strap.png", Math.round(fs.statSync(path.join(DEST, "lanyard-strap.png")).size / 1024) + "kb");
  process.exit(0);
}

const pvcGradient = (id = "pvc") =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e3f6fd"/>
      <stop offset="1" stop-color="${BODY_DEEP}"/>
    </linearGradient>`;

const tricolor = (y, h, w = FW) =>
  [
    `<rect x="0" y="${y}" width="${w * 0.42}" height="${h}" fill="${GREEN}"/>`,
    `<rect x="${w * 0.42}" y="${y}" width="${w * 0.16}" height="${h}" fill="${YELLOW}"/>`,
    `<rect x="${w * 0.58}" y="${y}" width="${w * 0.42}" height="${h}" fill="${RED}"/>`,
  ].join("");

// --- recursos rasterizados ------------------------------------------------

const PINK = "#e8287d";
const CELESTE = "#3db8e8";

const png = (input, opts) => sharp(input).resize(opts).png().toBuffer();
const meta = (buf) => sharp(buf).metadata();

const [campaignLogo, cosmo] = await Promise.all([
  png("public/infancias/logo.webp", { width: 280 }),
  sharp("public/festipeques/cosmo.webp")
    .resize(500, 700, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer(),
]);

const logoMeta = await meta(campaignLogo);
const cosmoMeta = await meta(cosmo);

const BAND_Y = 176;
const BAND_H = 96;

function pill(label, { x, y, w, fill }) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="48" rx="24" fill="${fill}"/>`,
    text("bold", label, { size: 15, x: x + w / 2, y: y + 32, ls: 1.4, fill: "#ffffff", anchor: "middle" }),
  ].join("");
}

// --- frente ---------------------------------------------------------------

const frontSvg = Buffer.from(`
<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${pvcGradient()}
    <radialGradient id="glow" cx="50%" cy="58%" r="42%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${BODY}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${FW}" height="${FH}" fill="url(#pvc)"/>
  ${guilloche({ x: -20, y: 300, w: FW + 40, h: 1100, lines: 20, color: PINK, opacity: 0.07 })}
  <circle cx="540" cy="900" r="340" fill="url(#glow)"/>

  <circle cx="540" cy="122" r="36" fill="none" stroke="${HAIRLINE}" stroke-width="2" opacity="0.5"/>

  <rect x="0" y="${BAND_Y}" width="${FW}" height="${BAND_H}" fill="${BAND}"/>
  ${tricolor(BAND_Y + BAND_H, 8)}
  ${text("bold", "EDUCACI\u00d3N  \u00b7  JUEGO  \u00b7  CUIDADO", { size: 18, x: FW / 2, y: BAND_Y + 42, ls: 2.2, fill: "#ffffff", anchor: "middle" })}
  ${text("medium", "+ comunidad", { size: 16, x: FW / 2, y: BAND_Y + 70, ls: 1.4, fill: "#c5cbd2", anchor: "middle" })}

  ${text("bold", "RECURSOS PARA LAS INFANCIAS", { size: 16, x: FW / 2, y: 318, ls: 4.2, fill: RED, anchor: "middle" })}

  ${pill("F.E.S.", { x: 48, y: 1368, w: 228, fill: NAVY })}
  ${pill("1\u00aa infancia", { x: 292, y: 1368, w: 240, fill: PINK })}
  ${pill("PAR", { x: 548, y: 1368, w: 228, fill: GREEN })}
  ${pill("L\u00ednea 102", { x: 792, y: 1368, w: 240, fill: CELESTE })}
</svg>`);

const frontPng = await sharp(frontSvg)
  .composite([
    {
      input: campaignLogo,
      top: 338,
      left: Math.round((FW - logoMeta.width) / 2),
    },
    {
      input: cosmo,
      top: 338 + logoMeta.height - 12,
      left: Math.round((FW - cosmoMeta.width) / 2),
    },
  ])
  .png()
  .toBuffer();

// --- dorso: PVC liso ------------------------------------------------------

const backSvg = Buffer.from(`
<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
  <defs>${pvcGradient("pvcBack")}</defs>
  <rect width="${FW}" height="${FH}" fill="url(#pvcBack)"/>
</svg>`);

const backPng = await sharp(backSvg).png().toBuffer();

// --- grano de PVC ---------------------------------------------------------

/** Ruido suave para que la impresión no se vea perfectamente plana. */
async function addGrain(input) {
  const grain = await sharp({
    create: {
      width: FW,
      height: FH,
      channels: 3,
      noise: { type: "gaussian", mean: 128, sigma: 5 },
    },
  })
    .png()
    .toBuffer();

  return sharp(input)
    .composite([{ input: grain, blend: "overlay" }])
    .png()
    .toBuffer();
}

const frontFinal = await addGrain(frontPng);
const backFinal = await addGrain(backPng);

await sharp(frontFinal).webp({ quality: 92 }).toFile(path.join(DEST, "card-front.webp"));
await sharp(backFinal).webp({ quality: 92 }).toFile(path.join(DEST, "card-back.webp"));

// --- atlas para card.glb --------------------------------------------------

const rectPx = (uv) => ({
  left: Math.round(uv.x0 * ATLAS),
  top: Math.round(uv.y0 * ATLAS),
  width: Math.round((uv.x1 - uv.x0) * ATLAS),
  height: Math.round((uv.y1 - uv.y0) * ATLAS),
});

const frontRect = rectPx(FRONT_UV);
const backRect = rectPx(BACK_UV);

// El rect UV y la cara del modelo no tienen la misma proporción: al estirar el
// arte para llenar el rect, la geometría lo devuelve a su proporción original.
const frontFit = await sharp(frontFinal)
  .resize(frontRect.width, frontRect.height, { fit: "fill" })
  .png()
  .toBuffer();
const backFit = await sharp(backFinal)
  .resize(backRect.width, backRect.height, { fit: "fill" })
  .png()
  .toBuffer();

await sharp({
  create: { width: ATLAS, height: ATLAS, channels: 3, background: BODY },
})
  .composite([
    { input: frontFit, top: frontRect.top, left: frontRect.left },
    { input: backFit, top: backRect.top, left: backRect.left },
  ])
  .webp({ quality: 90 })
  .toFile(path.join(DEST, "card-atlas.webp"));

for (const f of ["card-front.webp", "card-back.webp", "card-atlas.webp", "lanyard-strap.png", "card.glb"]) {
  console.log(f, Math.round(fs.statSync(path.join(DEST, f)).size / 1024) + "kb");
}
