import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().trim().min(3, 'title must be at least 3 characters long').max(100, 'title cannot exceed 100 characters'),
    github: z.string().trim().url('please provide a valid github url'),
    visit: z.string().trim().url('please provide a valid visit url'),
    description: z.string().trim().min(10, 'description must be at least 10 characters long').max(1000, 'description cannot exceed 1000 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in yyyy-mm-dd format'),
    tags: z.array(z.string()).nonempty('at least one tag is required'),
    images: z.string().optional()
});