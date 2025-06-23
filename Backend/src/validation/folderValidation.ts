import { z } from 'zod';

export const folderSchema = z.object({
    name: z.string().min(1),
    parentId: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    lastOpenedAt: z.string().datetime(),
});

export const folderUpdateSchema = folderSchema.partial();