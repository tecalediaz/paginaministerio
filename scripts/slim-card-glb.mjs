/**
 * card.glb trae un atlas PNG horneado de 2,2 MB (la credencial de React Bits).
 * Nosotros pintamos la credencial con nuestro propio atlas, así que acá
 * sacamos la imagen embebida y reconstruimos el binario sin ese bufferView.
 * Los UV del modelo no se tocan: el atlas propio se genera con el mismo layout.
 */
import fs from "fs";

const SRC = "public/festipeques/card.glb";
const OUT = "public/festipeques/card.glb";

const buf = fs.readFileSync(SRC);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("no es un glb");

const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
const binLen = buf.readUInt32LE(20 + jsonLen);
const bin = buf.subarray(20 + jsonLen + 8, 20 + jsonLen + 8 + binLen);

if (!json.images?.length) {
  console.log("ya está adelgazado, nada que hacer");
  process.exit(0);
}

const dropped = new Set(json.images.map((img) => img.bufferView));

const keep = [];
const remap = new Map();
const chunks = [];
let offset = 0;
json.bufferViews.forEach((bv, i) => {
  if (dropped.has(i)) return;
  const start = bv.byteOffset ?? 0;
  const data = bin.subarray(start, start + bv.byteLength);
  const padded = data.byteLength % 4 === 0 ? data : Buffer.concat([data, Buffer.alloc(4 - (data.byteLength % 4))]);
  remap.set(i, keep.length);
  keep.push({ ...bv, byteOffset: offset });
  chunks.push(padded);
  offset += padded.byteLength;
});

json.bufferViews = keep;
for (const acc of json.accessors) acc.bufferView = remap.get(acc.bufferView);
json.buffers = [{ byteLength: offset }];

delete json.images;
delete json.textures;
delete json.samplers;
for (const mat of json.materials) delete mat.pbrMetallicRoughness?.baseColorTexture;

const jsonChunk = Buffer.from(JSON.stringify(json), "utf8");
const jsonPad = Buffer.alloc((4 - (jsonChunk.byteLength % 4)) % 4, 0x20);
const binChunk = Buffer.concat(chunks);

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.byteLength + jsonPad.byteLength + 8 + binChunk.byteLength, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonChunk.byteLength + jsonPad.byteLength, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);

const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binChunk.byteLength, 0);
binHeader.writeUInt32LE(0x004e4942, 4);

fs.writeFileSync(OUT, Buffer.concat([header, jsonHeader, jsonChunk, jsonPad, binHeader, binChunk]));
console.log(
  "card.glb:",
  Math.round(buf.byteLength / 1024) + "kb ->",
  Math.round(fs.statSync(OUT).size / 1024) + "kb",
);
