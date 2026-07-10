import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Not a valid email"),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID format"),
    }),
    body: z.object({
        name: z.string().min(1, "Name cannot be empty").optional(),
        email: z.string().email("Not a valid email").optional(),
    }).refine(data => data.name !== undefined || data.email !== undefined, {
        message: "At least one of 'name' or 'email' must be provided to update.",
    }),
});

export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID format"),
    }),
});
