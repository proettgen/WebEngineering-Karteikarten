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

export const cardFilterSchema = z.object({
    folderId: z.string().uuid().optional(),
    tags: z.string().optional(),
    title: z.string().optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional(),
});

export const cardSortSchema = z.object({
    sortBy: z.enum(['createdAt', 'currentLearningLevel']).optional(),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
});