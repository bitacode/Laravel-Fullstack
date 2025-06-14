import { z } from 'zod';

export const registrationSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    email: z.string().min(1, 'Email is required').email('This is not a valid email'),
    bank_name_primary: z.string().min(1, 'Bank account is required'),
    bank_account_primary: z.string().regex(/^\d+$/, { message: 'Account number invalid'}).min(1, 'Bank account number is required'),
});