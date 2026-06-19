/**
 * One-off source image optimizer.
 *
 * Downscales oversized originals in src/assets to a sane max width and
 * recompresses them in place, preserving filename and format so existing
 * imports (and Astro's image pipeline) keep working. Source photos shot at
 * 6000–8000px are far larger than any screen needs; this caps them.
 *
 * A full backup of src/assets was taken before running this.
 *
 * Usage: node scripts/optimize-source-images.mjs [--dry]
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'src/assets';
const MAX_WIDTH = 2560; // covers 4K / retina with margin
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 9;
const DRY = process.argv.includes('--dry');

const exts = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let count = 0;
let beforeTotal = 0;
let afterTotal = 0;
let skipped = 0;

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!exts.has(ext)) continue;

  const before = (await stat(file)).size;
  beforeTotal += before;

  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();

  // Build the transform: only downscale, never upscale.
  let pipeline = img.rotate(); // respect EXIF orientation
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const tmp = file + '.tmp';
  if (DRY) {
    const buf = await pipeline.toBuffer();
    afterTotal += buf.length;
  } else {
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;
    // Keep the smaller of the two: never make a file bigger.
    if (after >= before) {
      await unlink(tmp);
      afterTotal += before;
      skipped++;
      continue;
    }
    await rename(tmp, file);
    afterTotal += after;
  }
  count++;
  const mb = (n) => (n / 1048576).toFixed(1);
  console.log(`${meta.width}px→${Math.min(meta.width ?? 0, MAX_WIDTH)}px  ${mb(before)}MB→${mb(DRY ? 0 : afterTotal)}…  ${file}`);
}

const mb = (n) => (n / 1048576).toFixed(0);
console.log('\n--- summary ---');
console.log(`processed: ${count}, left untouched (already small): ${skipped}`);
console.log(`before: ${mb(beforeTotal)} MB  →  after: ${mb(afterTotal)} MB  (${DRY ? 'DRY RUN' : 'written'})`);
