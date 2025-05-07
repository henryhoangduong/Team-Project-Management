import { z } from 'zod'
export const emojiSchema = z.string().trim().optional()
export const nameSchema = z.string().trim().min(1).max(255)
export const descriptionSchema = z.string().trim().optional()

export const projectIdSchema = z.string().trim().min(1)

export const createProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  emojiSchema: emojiSchema
})

export const updateProjectSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  emojiSchema: emojiSchema
})
