import {z} from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']).optional().default('draft')
});

export const updatePostSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty').max(255).optional(),
    content: z.string().min(1, 'Content cannot be empty').optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']).optional().default('draft')
});

export const addCommentSchema = z.object({
    content: z.string().min(1, 'Comment content is required'),
    parentId: z.number().int().positive().optional()
});
