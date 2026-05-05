import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const marcas = defineCollection({
  loader: glob({ base: './src/content/marcas', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      slug: z.enum(['exxan', 'resimex', 'econorte']),
      nombre: z.string(),
      tagline: z.string(),
      descripcionCorta: z.string(),
      heroImage: image(),
      cardImage: image(),
      logoImage: image(),
      propuestaValor: z.array(
        z.object({
          titulo: z.string(),
          descripcion: z.string(),
        })
      ),
      queHacemos: z.array(z.string()),
      materialesRecibimos: z.array(z.string()).optional(),
      materialesNoRecibimos: z.array(z.string()).optional(),
      mision: z.string(),
      vision: z.string(),
      orden: z.number(),
    }),
});

export const collections = { marcas };
