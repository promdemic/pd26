/**
 * One-off image optimization script.
 * Run with: bun run scripts/optimize-images.ts
 * Outputs optimized WebP + JPEG fallback to src/assets/
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const SRC = `${process.env.HOME}/Desktop/pd25.jpeg`;
const OUT = "src/assets";

mkdirSync(OUT, { recursive: true });

const sizes = [
  { name: "hero-sm", width: 800 },   // mobile
  { name: "hero-lg", width: 1920 },  // desktop
];

for (const { name, width } of sizes) {
  const img = sharp(SRC).resize(width);

  await img.clone().webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`);
  await img.clone().jpeg({ quality: 82, progressive: true }).toFile(`${OUT}/${name}.jpg`);

  const webpSize = Bun.file(`${OUT}/${name}.webp`).size;
  const jpgSize = Bun.file(`${OUT}/${name}.jpg`).size;
  console.log(`${name}: WebP ${(webpSize / 1024).toFixed(0)}KB · JPEG ${(jpgSize / 1024).toFixed(0)}KB`);
}
