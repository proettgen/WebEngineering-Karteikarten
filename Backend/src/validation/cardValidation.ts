import { z } from 'zod';

export const cardSchema = z.object({
    title: z.string(),
    question: z.string(),
    answer: z.string(),
    currentLearningLevel: z.number(),
    createdAt: z.string().datetime(),
    tags: z.array(z.string()).nullable().optional(),
    folderId: z.string(),
});

export const cardUpdateSchema = cardSchema.partial();