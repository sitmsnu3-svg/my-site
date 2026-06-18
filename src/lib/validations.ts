import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Thread schemas
export const createThreadSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(10000),
  categoryId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
})

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  threadId: z.string().cuid(),
})

// Guild schemas
export const createGuildSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
})

// Category schemas (admin)
export const createCategorySchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  icon: z.string().max(10).optional(),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  requireRole: z.string().optional(),
  rules: z.string().max(2000).optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

// User schemas (admin)
export const updateUserRoleSchema = z.object({
  role: z.enum(['ADVENTURER', 'MODERATOR', 'ADMIN']),
})

// Notification schemas
export const markNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string().cuid()),
})
