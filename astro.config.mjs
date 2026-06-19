// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import pruneUnreferencedImages from './scripts/prune-unreferenced-images.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), pruneUnreferencedImages()],

  // Preserve old contact URL after renaming the page to Canal de Denuncias.
  redirects: {
    '/contacto': '/canal-de-denuncias',
  },

  vite: {
    plugins: [tailwindcss()]
  }
});