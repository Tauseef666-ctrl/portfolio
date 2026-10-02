import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("./_temp_raw_frames");
const outputDir = path.resolve("./public/frames");
const mobileOutputDir = path.resolve("./public/frames/mobile");

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(mobileOutputDir, { recursive: true });

const files = (await fs.readdir(inputDir))
  .filter((f) => f.endsWith(".png"))
  .sort();

console.log(`Found ${files.length} frames. Starting conversion...`);

const start = performance.now();
let desktopBytes = 0;
let mobileBytes = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const inPath = path.join(inputDir, file);
  const baseName = path.parse(file).name;
  const outDesktop = path.join(outputDir, `${baseName}.webp`);
  const outMobile = path.join(mobileOutputDir, `${baseName}.webp`);

  const img = sharp(inPath);

  // Desktop (1280x720, WebP, quality 82)
  const desktopBuf = await img
    .clone()
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  await fs.writeFile(outDesktop, desktopBuf);
  desktopBytes += desktopBuf.length;

  // Mobile (640x360, WebP, quality 80)
  const mobileBuf = await img
    .clone()
    .resize(640, 360, { fit: "cover" })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();
  await fs.writeFile(outMobile, mobileBuf);
  mobileBytes += mobileBuf.length;

  if ((i + 1) % 40 === 0 || i === files.length - 1) {
    console.log(`Processed ${i + 1}/${files.length} frames...`);
  }
}

const elapsed = ((performance.now() - start) / 1000).toFixed(1);
console.log(`Conversion completed in ${elapsed}s!`);
console.log(`Desktop total size: ${(desktopBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Mobile total size: ${(mobileBytes / (1024 * 1024)).toFixed(2)} MB`);

const manifest = {
  frameCount: files.length,
  width: 1280,
  height: 720,
  mobileWidth: 640,
  mobileHeight: 360,
  fps: 24,
  durationSeconds: +(files.length / 24).toFixed(2),
  desktopPattern: "frames/frame_{index}.webp",
  mobilePattern: "frames/mobile/frame_{index}.webp",
  padding: 6,
  firstFrame: "frames/frame_000001.webp",
  lastFrame: `frames/frame_${String(files.length).padStart(6, "0")}.webp`,
};

await fs.writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log("Wrote manifest.json.");
