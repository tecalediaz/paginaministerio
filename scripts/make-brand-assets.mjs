/**
 * Piezas de marca para SEO / compartir / PWA.
 *
 *   public/og.jpg                 Open Graph 1200×630
 *   public/favicon.ico            32×32
 *   public/icon-32.png
 *   public/apple-touch-icon.png   180×180
 *   public/icon-192.png
 *   public/icon-512.png
 *   app/icon.png                  Next (favicon)
 *   app/apple-icon.png
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const GREEN = "#4caf50";
const RED = "#e52138";
const YELLOW = "#fdc80a";
const ISO_GREEN = "#41ab3f";
const BG = "#f6f7f6";
const CELESTE = "#3db8e8";

const svgDensity = (file, widthPx) => {
  const raw = fs.readFileSync(file, "utf8");
  const vb = raw.match(/viewBox="([^"]+)"/i)?.[1].split(/[\s,]+/).map(Number);
  const vw = vb?.[2] || 100;
  return Math.round((72 * widthPx) / vw);
};

async function pngContain(file, { width, height }) {
  const img = file.endsWith(".svg")
    ? sharp(file, {
        density: svgDensity(file, Math.max(width || 0, height || 0, 256)),
      })
    : sharp(file);
  return img
    .resize({
      width,
      height,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(size, 0);
  dir.writeUInt8(size, 1);
  dir.writeUInt32LE(png.length, 8);
  dir.writeUInt32LE(22, 12);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  return Buffer.concat([header, dir, png]);
}

async function makeIcon(size, padRatio) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const iso = await sharp("public/logo-gob-rioja.svg", { density: 1024 })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const m = await sharp(iso).metadata();
  const left = Math.round((size - m.width) / 2);
  const top = Math.round((size - m.height) / 2);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    },
  })
    .composite([{ input: iso, left, top }])
    .png()
    .toBuffer();
}

const lariojaH = 248;
const ministerioW = 500;
const cosmoH = 604;

const [larioja, ministerio, cosmo] = await Promise.all([
  pngContain("public/LA_RIOJA_Gobierno.png", { height: lariojaH }),
  pngContain("public/ministerio.svg", { width: ministerioW }),
  sharp("public/festipeques/cosmo.webp")
    .resize({
      height: cosmoH,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer(),
]);

const [lariojaMeta, minMeta, cosmoMeta] = await Promise.all([
  sharp(larioja).metadata(),
  sharp(ministerio).metadata(),
  sharp(cosmo).metadata(),
]);

const leftX = 108;
const stackGap = 40;
const stackH = lariojaMeta.height + stackGap + minMeta.height;
const stackY = Math.round((H - stackH) / 2);
const minY = stackY + lariojaMeta.height + stackGap;
const cosmoX = W - 28 - cosmoMeta.width;
const cosmoY = 14;

const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <ellipse cx="1020" cy="340" rx="420" ry="460" fill="${CELESTE}" opacity="0.16"/>
  <ellipse cx="980" cy="300" rx="280" ry="300" fill="#ffffff" opacity="0.55"/>
  <ellipse cx="180" cy="560" rx="340" ry="200" fill="#f0e080" opacity="0.22"/>
  <ellipse cx="70" cy="80" rx="220" ry="140" fill="#b0d0d0" opacity="0.28"/>
</svg>`);

const bars = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="10" fill="${GREEN}"/>
  <rect y="${H - 8}" width="400" height="8" fill="${RED}"/>
  <rect y="${H - 8}" x="400" width="400" height="8" fill="${ISO_GREEN}"/>
  <rect y="${H - 8}" x="800" width="400" height="8" fill="${YELLOW}"/>
</svg>`);

const ogPng = await sharp(bg)
  .composite([
    { input: larioja, left: leftX, top: stackY },
    { input: ministerio, left: leftX, top: minY },
    { input: cosmo, left: cosmoX, top: cosmoY },
    { input: bars, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toBuffer();

await sharp(ogPng).toFile("public/og.jpg");

const [icon32, icon180, icon192, icon512] = await Promise.all([
  makeIcon(32, 0.1),
  makeIcon(180, 0.14),
  makeIcon(192, 0.14),
  makeIcon(512, 0.16),
]);

fs.writeFileSync("public/icon-32.png", icon32);
fs.writeFileSync("public/apple-touch-icon.png", icon180);
fs.writeFileSync("public/icon-192.png", icon192);
fs.writeFileSync("public/icon-512.png", icon512);
fs.writeFileSync("public/favicon.ico", pngToIco(icon32, 32));
fs.writeFileSync("app/favicon.ico", pngToIco(icon32, 32));
fs.writeFileSync("app/icon.png", icon32);
fs.writeFileSync("app/apple-icon.png", icon180);

const ogStat = fs.statSync("public/og.jpg");
console.log("og.jpg", ogStat.size, "bytes");
console.log("larioja", lariojaMeta.width, lariojaMeta.height, "at", leftX, stackY);
console.log("ministerio", minMeta.width, minMeta.height, "at", leftX, minY);
console.log("cosmo", cosmoMeta.width, cosmoMeta.height, "at", cosmoX, cosmoY);
