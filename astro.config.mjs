// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Preserve old contact URL after renaming the page to Canal de Denuncias.
  redirects: {
    '/contacto': '/canal-de-denuncias',
  },

  vite: {
    plugins: [tailwindcss()]
  }
});