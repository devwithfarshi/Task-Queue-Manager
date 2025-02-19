import { z } from 'zod'
const createEmailTask = z.object({
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(3),
  howMuchMessage: z.number().int().max(10).positive()
})
const updateEmailTask = z.object({
  email: z.string().email().optional(),
  subject: z.string().min(3).optional(),
  message: z.string().min(3).optional(),
  howMuchMessage: z.number().int().positive().optional()
})
export default {
  createEmailTask,
  updateEmailTask
}
