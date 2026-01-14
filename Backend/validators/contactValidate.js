import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().trim().min(2, 'name must be at least 2 characters long').max(100, 'name cannot exceed 100 characters'),
    email: z.string().trim().email('please provide a valid email address'),
    message: z.string().trim().min(5, 'message must be at least 5 characters long').max(1000, 'message cannot exceed 1000 characters'),
});