import { z } from 'zod'

const userRegistrationSchema = z.object({
  username: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})
const userLoginSchema = z
  .object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8)
  })
  .refine((data) => data.username || data.email, {
    message: 'required',
    path: ['email']
  })
const forgotPasswordSchema = z.object({
  email: z.string().email()
})

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8)
})
export default {
  userRegistrationSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
}
