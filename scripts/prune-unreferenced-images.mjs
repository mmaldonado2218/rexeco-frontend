import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro integration: after build, delete original raster images (jpg/jpeg/png)
 * that no emitted HTML/JS/CSS references.
 *
 * Why this exists: importing a local image (e.g. via `import.meta.glob` for the
 * PhotoSwipe galleries) makes Astro emit the ORIGINAL file to dist as a side
 * effect, even when the page only ever serves the webp produced by getImage().
 * There is no Astro option to get ImageMetadata without emitting the original,
 * so we prune the dead originals after the webp are already wired into the HTML.
 *
 * Guardrails:
 *  - Only deletes .jpg/.jpeg/.png. Never touches .webp/.avif/.svg/.ico/fonts.
 *  - Matches by exact emitted filename (URL-decoded) found in HTML/JS/CSS, so a
 *    referenced original is always kept.
 */

const PRUNABLE = new Set(['.jpg', '.jpeg', '.png']);
const SCANNED = new Set(['.html', '.js', '.css']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

export default function pruneUnreferencedImages() {
  return {
    name: 'prune-unreferenced-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);

        // 1. Collect every asset filename referenced by emitted text files.
        const referenced = new Set();
        const files = [];
        for await (const f of walk(root)) files.push(f);

        for (const f of files) {
          if (!SCANNED.has(extname(f).toLowerCase())) continue;
          const text = await readFile(f, 'utf8');
          // Match any /_astro/<name>.<ext> token, decode URL-encoding (spaces,
          // accents) so "Bronce%20lat%C3%B3n.JPG" matches the file on disk.
          const re = /[^"'`()\s,]+?\.(?:webp|avif|jpe?g|png|svg|gif|ico)/gi;
          for (const m of text.matchAll(re)) {
            referenced.add(decodeURIComponent(basename(m[0])));
          }
        }

        // 2. Delete prunable originals not referenced anywhere.
        let removed = 0;
        let freed = 0;
        for (const f of files) {
          if (!PRUNABLE.has(extname(f).toLowerCase())) continue;
          if (referenced.has(basename(f))) continue;
          const size = (await stat(f)).size;
          await unlink(f);
          removed++;
          freed += size;
        }

        const mb = (freed / 1048576).toFixed(1);
        logger.info(`pruned ${removed} unreferenced original image(s), freed ${mb} MB`);
      },
    },
  };
}
