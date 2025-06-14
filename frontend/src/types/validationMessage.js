import { z } from 'zod';

export const messageSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('This is not a valid email'),
    message: z.string().min(1, 'Message is required')
});