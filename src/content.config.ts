import { defineCollection, z } from 'astro:content';

const conciertos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(),
    venue: z.string(),
    venueAddress: z.string().optional(),
    artists: z.array(z.string()).default([]),
    program: z
      .array(
        z.object({
          composer: z.string(),
          work: z.string(),
        }),
      )
      .default([]),
    ticketPrice: z.number().optional(),
    ticketUrl: z.string().url().optional(),
    image: z.string().optional(),
    season: z.string().optional(),
    status: z.enum(['upcoming', 'past', 'cancelled']).default('upcoming'),
    excerpt: z.string().optional(),
  }),
});

const artistas = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    instrument: z.string(),
    country: z.string().optional(),
    photo: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    publishDate: z.coerce.date(),
    category: z.string().default('noticias'),
    excerpt: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { conciertos, artistas, articulos };
