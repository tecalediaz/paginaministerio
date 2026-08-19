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
import QRCode from "qrcode";
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
  const unit = "MINISTERIODEDESARROLLOIGUALDADEINTEGRACIONSOCIAL\u00b7";
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
  const strapUnit = outline(fonts.bold, "MDIIS \u00b7 LA RIOJA \u00b7 ", 36, 6.5);
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

const png = (input, opts) => sharp(input).resize(opts).png().toBuffer();
const meta = (buf) => sharp(buf).metadata();

const [shieldLight, shieldDark, festiLogo, ministerioMark] = await Promise.all([
  png("public/logo-gob-rioja.svg", { height: 104 }),
  png("public/logo-gob-rioja.svg", { height: 96 }),
  png(path.join(DEST, "logo.webp"), { width: 372 }),
  png("public/ministerio.svg", { width: 560 }),
]);

const PHOTO = { x: 54, y: 520, w: 372, h: 458, r: 18 };

const photoMask = Buffer.from(
  `<svg width="${PHOTO.w}" height="${PHOTO.h}" xmlns="http://www.w3.org/2000/svg"><rect width="${PHOTO.w}" height="${PHOTO.h}" rx="${PHOTO.r}" fill="#fff"/></svg>`,
);

const cosmoPortrait = await sharp(path.join(DEST, "cosmo.webp"))
  .resize(PHOTO.w - 24, PHOTO.h - 40, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({
    top: 20,
    bottom: 20,
    left: 12,
    right: 12,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .composite([{ input: photoMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const GHOST = 132;
const cosmoGhost = await sharp(path.join(DEST, "cosmo.webp"))
  .resize(GHOST, GHOST, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .grayscale()
  .composite([
    {
      input: Buffer.from(
        `<svg width="${GHOST}" height="${GHOST}" xmlns="http://www.w3.org/2000/svg"><rect width="${GHOST}" height="${GHOST}" fill="#fff" fill-opacity="0.3"/></svg>`,
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

const SEAL = 108;
const seal = Buffer.from(`
<svg width="${SEAL}" height="${SEAL}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ovd" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="0.3" stop-color="#cfe3ef" stop-opacity="0.9"/>
      <stop offset="0.55" stop-color="#f2e6c9" stop-opacity="0.9"/>
      <stop offset="0.8" stop-color="#d9e9d6" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <circle cx="${SEAL / 2}" cy="${SEAL / 2}" r="${SEAL / 2 - 2}" fill="url(#ovd)" stroke="#ffffff" stroke-width="2"/>
  <circle cx="${SEAL / 2}" cy="${SEAL / 2}" r="${SEAL / 2 - 12}" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.85"/>
  ${Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const r1 = SEAL / 2 - 14;
    const r2 = SEAL / 2 - 30;
    return `<line x1="${(SEAL / 2 + Math.cos(a) * r1).toFixed(1)}" y1="${(SEAL / 2 + Math.sin(a) * r1).toFixed(1)}" x2="${(SEAL / 2 + Math.cos(a) * r2).toFixed(1)}" y2="${(SEAL / 2 + Math.sin(a) * r2).toFixed(1)}" stroke="#ffffff" stroke-width="1.6" opacity="0.8"/>`;
  }).join("")}
  ${text("black", "MDIIS", { size: 19, x: SEAL / 2, y: SEAL / 2 + 7, anchor: "middle", fill: "#5c6b78", opacity: 0.85 })}
</svg>`);

// --- frente ---------------------------------------------------------------

const shieldLightMeta = await meta(shieldLight);
const festiMeta = await meta(festiLogo);
const ministerioMeta = await meta(ministerioMark);

const headerTextX = 54 + shieldLightMeta.width + 30;
const FIELDS_X = 458;

const frontSvg = Buffer.from(`
<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${pvcGradient()}
    <linearGradient id="photoBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf6fc"/>
      <stop offset="1" stop-color="#cfe6f3"/>
    </linearGradient>
  </defs>
  <rect width="${FW}" height="${FH}" fill="url(#pvc)"/>
  ${guilloche({ x: -20, y: 372, w: FW + 40, h: 960, lines: 22, color: "#3db8e8", opacity: 0.12 })}

  <circle cx="540" cy="122" r="36" fill="none" stroke="${HAIRLINE}" stroke-width="2" opacity="0.5"/>

  <rect x="0" y="176" width="${FW}" height="172" fill="${BAND}"/>
  ${tricolor(348, 9)}
  ${text("bold", "GOBIERNO DE LA RIOJA", { size: 27, x: headerTextX, y: 242, ls: 5.2, fill: "#ffffff" })}
  ${text("medium", "Ministerio de Desarrollo, Igualdad", { size: 19.5, x: headerTextX, y: 276, ls: 0.6, fill: "#aeb6bf" })}
  ${text("medium", "e Integraci\u00f3n Social", { size: 19.5, x: headerTextX, y: 302, ls: 0.6, fill: "#aeb6bf" })}

  ${text("bold", "PASE DE ACCESO", { size: 21, x: 54, y: 400, ls: 7.5, fill: RED })}
  ${text("medium", "N\u00b0 2026-08-0147", { size: 19, x: 1026, y: 400, ls: 1.4, fill: LABEL, anchor: "end" })}

  ${text("black", "Mes de las Infancias", { size: 55, x: 52, y: 458, fill: NAVY })}
  ${text("medium", "Programa Festi Peques \u00b7 Infancias cuidadas", { size: 21, x: 54, y: 494, fill: MUTED })}

  <rect x="${PHOTO.x}" y="${PHOTO.y}" width="${PHOTO.w}" height="${PHOTO.h}" rx="${PHOTO.r}" fill="url(#photoBg)"/>
  <rect x="${PHOTO.x + 0.75}" y="${PHOTO.y + 0.75}" width="${PHOTO.w - 1.5}" height="${PHOTO.h - 1.5}" rx="${PHOTO.r}" fill="none" stroke="${HAIRLINE}" stroke-width="1.5"/>

  ${labelledField("TITULAR", "Cosmo", { x: FIELDS_X, y: 556, valueSize: 34, valueWeight: "bold" })}
  ${labelledField("ROL", "Mascota oficial", { x: FIELDS_X, y: 664 })}
  ${labelledField("EDICI\u00d3N", "Agosto 2026", { x: FIELDS_X, y: 772 })}
  ${labelledField("ALCANCE", "Toda la provincia", { x: FIELDS_X, y: 880 })}

  ${barcode({ x: 54, y: 1352, w: 972, h: 58 })}
  ${text("medium", "MDIIS \u00b7 LA RIOJA \u00b7 2026 \u00b7 0147", { size: 21, x: FW / 2, y: 1452, ls: 5.5, fill: "#4a5058", anchor: "middle" })}
  ${microtext({ x: 54, y: 1496, w: 972 })}
</svg>`);

const frontPng = await sharp(frontSvg)
  .composite([
    { input: shieldLight, top: 210, left: 54 },
    { input: cosmoPortrait, top: PHOTO.y, left: PHOTO.x },
    { input: cosmoGhost, top: 848, left: 1026 - GHOST },
    { input: seal, top: PHOTO.y + PHOTO.h - SEAL / 2 - 26, left: PHOTO.x + PHOTO.w - SEAL / 2 - 20 },
    { input: festiLogo, top: 1004, left: Math.round((FW - festiMeta.width) / 2) },
  ])
  .png()
  .toBuffer();

// --- dorso ----------------------------------------------------------------

const qr = QRCode.create("https://desarrollosocial.larioja.gob.ar", { errorCorrectionLevel: "M" });
const QR_PX = 288;
const qrSize = qr.modules.size;
const cell = QR_PX / (qrSize + 4);
const qrCells = [];
for (let r = 0; r < qrSize; r++) {
  for (let c = 0; c < qrSize; c++) {
    if (!qr.modules.data[r * qrSize + c]) continue;
    qrCells.push(
      `<rect x="${((c + 2) * cell).toFixed(2)}" y="${((r + 2) * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`,
    );
  }
}

const QR = { x: 54, y: 706 };
const RIGHT_X = 402;

const terms = [
  "Esta credencial es personal e intransferible.",
  "Debe exhibirse durante las actividades del programa.",
  "En caso de p\u00e9rdida, avisar al equipo organizador.",
  "V\u00e1lida \u00fanicamente durante agosto de 2026.",
];

const backSvg = Buffer.from(`
<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
  <defs>${pvcGradient("pvcBack")}</defs>
  <rect width="${FW}" height="${FH}" fill="url(#pvcBack)"/>
  ${guilloche({ x: -20, y: 470, w: FW + 40, h: 700, lines: 14, color: NAVY, opacity: 0.05 })}

  <circle cx="540" cy="122" r="36" fill="none" stroke="${HAIRLINE}" stroke-width="2" opacity="0.5"/>

  <rect x="0" y="176" width="${FW}" height="116" fill="${BAND}"/>
  ${tricolor(292, 9)}
  ${text("bold", "GOBIERNO DE LA RIOJA", { size: 20, x: FW / 2, y: 224, ls: 6, fill: "#ffffff", anchor: "middle" })}
  ${text("medium", "Ministerio de Desarrollo, Igualdad e Integraci\u00f3n Social", { size: 18, x: FW / 2, y: 258, ls: 0.8, fill: "#aeb6bf", anchor: "middle" })}

  <rect x="0" y="340" width="${FW}" height="112" fill="#17191c"/>
  <rect x="0" y="346" width="${FW}" height="3" fill="#33383d"/>
  <rect x="0" y="440" width="${FW}" height="2" fill="#0e1012"/>

  ${text("bold", "CONDICIONES DE USO", { size: 19, x: 54, y: 524, ls: 6, fill: RED })}
  ${terms.map((t, i) => text("regular", t, { size: 21, x: 54, y: 570 + i * 34, fill: "#5b626b" })).join("")}

  <rect x="${QR.x}" y="${QR.y}" width="${QR_PX}" height="${QR_PX}" fill="#ffffff"/>
  <g transform="translate(${QR.x} ${QR.y})" fill="#17191c">${qrCells.join("")}</g>
  <rect x="${QR.x + 0.75}" y="${QR.y + 0.75}" width="${QR_PX - 1.5}" height="${QR_PX - 1.5}" fill="none" stroke="${HAIRLINE}" stroke-width="1.5"/>
  ${text("medium", "desarrollosocial.larioja.gob.ar", { size: 17, x: QR.x, y: QR.y + QR_PX + 34, fill: "#5b626b" })}

  ${text("bold", "GOBIERNO DE LA RIOJA", { size: 19, x: RIGHT_X, y: 846, ls: 4, fill: INK })}
  ${text("medium", "Provincia de La Rioja", { size: 19, x: RIGHT_X, y: 878, fill: MUTED })}
  ${text("regular", "Av. Alem y Av. Los Caudillos", { size: 18, x: RIGHT_X, y: 922, fill: LABEL })}
  ${text("regular", "+54 0380 445-3156", { size: 18, x: RIGHT_X, y: 950, fill: LABEL })}

  <line x1="54" y1="1124" x2="600" y2="1124" stroke="${HAIRLINE}" stroke-width="1.6"/>
  ${text("bold", "FIRMA DEL TITULAR", { size: 14, x: 54, y: 1154, ls: 4, fill: LABEL })}

  ${barcode({ x: 54, y: 1402, w: 972, h: 62, seed: 23 })}
  ${microtext({ x: 54, y: 1502, w: 972 })}
</svg>`);

const backPng = await sharp(backSvg)
  .composite([
    { input: shieldDark, top: 706, left: RIGHT_X },
    { input: ministerioMark, top: 1206, left: Math.round((FW - ministerioMeta.width) / 2) },
  ])
  .png()
  .toBuffer();

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
