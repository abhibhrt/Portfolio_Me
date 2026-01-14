import { z } from 'zod';

export const progressSchema = z.object({
    category: z.string().trim().min(3, 'category must be at least 3 characters long').max(50, 'category cannot exceed 50 characters'),
    status: z.number().int().min(0).max(1).default(0),
    note: z.string().trim().max(200, 'note cannot exceed 200 characters').optional(),
    record: z.array(z.string()).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in yyyy-mm-dd format').optional()
});