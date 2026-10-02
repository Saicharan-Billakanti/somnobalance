// Robust fix for the "white spot" artifact at the base of the oil-blend
// and room-spray bottle photos: the original photography has the bottle's
// own base fading to near-black with zero reliable contrast against the
// true black backdrop in a thin strip at the very bottom, so no
// threshold/flood-fill can safely tell "bottle" from "background" there.
// Rather than guess (which either eats the bottle or leaves a visible
// defect), this finds the lowest row where the bottle is still
// confidently distinguishable (luminance > SAFE_LUM) and recomposites
// the image: flood-fill-from-edges above that row (safe, as before),
// then a plain white fill below it — never inventing bottle pixels that
// aren't actually resolvable in the source.
const sharp = require("sharp");

const INPUT = process.argv[2];
const OUTPUT = process.argv[3];
const THRESH = Number(process.argv[4] || 20);
const SAFE_LUM = Number(process.argv[5] || 15);

async function run() {
  const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Find safe bottom row (scanning the middle 40% of columns where the
  // bottle body sits, avoiding edge noise).
  let safeBottom = height - 1;
  for (let y = height - 1; y >= 0; y--) {
    let maxLum = 0;
    for (let x = Math.floor(width * 0.3); x < Math.floor(width * 0.7); x += 2) {
      const idx = (y * width + x) * channels;
      const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      if (lum > maxLum) maxLum = lum;
    }
    if (maxLum > SAFE_LUM) { safeBottom = y; break; }
  }
  console.log("safeBottom row:", safeBottom, "of", height);

  const isBlack = (idx) => {
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    return (r + g + b) / 3 <= THRESH;
  };

  const visited = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push([x, 0]);
  for (let y = 0; y <= safeBottom; y++) stack.push([0, y], [width - 1, y]);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y > safeBottom) continue;
    const pos = y * width + x;
    if (visited[pos]) continue;
    const idx = pos * channels;
    if (!isBlack(idx)) continue;
    visited[pos] = 1;
    data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // Below the safe line: flatten everything to white. This is the zone
  // where bottle-vs-background can't be resolved, so we don't try — a
  // clean white floor reads correctly since the bottle's visible base
  // already ends at a rounded silhouette right above this line.
  for (let y = safeBottom + 1; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).webp({ quality: 92 }).toFile(OUTPUT);
  console.log("wrote", OUTPUT);
}

run().catch((e) => { console.error(e); process.exit(1); });
