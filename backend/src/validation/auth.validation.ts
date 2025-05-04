import { z } from 'zod'

export const emailSchema = z.string().trim().email('Invalid email address').min(1).max(255)

export const passwordScheam = z.string().trim().min(4)

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordScheam
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordScheam
})

export const workspaceIdSchema = z.string().trim().min(1, { message: 'Workspace ID is required' })
