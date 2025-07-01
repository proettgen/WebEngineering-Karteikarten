import { z } from 'zod';

export const paginationSchema = z.object({
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional(),
});

// Extended schema with search parameter for folder search
export const searchPaginationSchema = z.object({
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional(),
    search: z.string().min(1).optional(),
});