import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// descripcion acepta texto plano o una lista de opciones. La rama array va
// PRIMERA: z.coerce.string() acepta cualquier cosa (incluido un array, que
// aplanaría a "a,b,c"), así que probar el array antes evita que se trague la
// lista. Los items se coercionan a string para tolerar valores que YAML lee
// como números (p. ej. grados de acero "304", "316").
const materialItem = z.union([
  z.string(),
  z.object({
    titulo: z.string(),
    descripcion: z.union([z.array(z.coerce.string()), z.string()]),
  }),
]);
const materialesSchema = z.array(materialItem).optional();

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
      logoImage: z.string().optional(),
      propuestaValor: z.array(
        z.object({
          titulo: z.string(),
          descripcion: z.string(),
        })
      ),
      queHacemos: z.array(z.string()),
      materialesRecibimos: materialesSchema,
      materialesNoRecibimos: materialesSchema,
      mision: z.string(),
      vision: z.string(),
      orden: z.number(),
    }),
});

export const collections = { marcas };
