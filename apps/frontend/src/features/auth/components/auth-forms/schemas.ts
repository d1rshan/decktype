import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Username is required.'),
    email: z.string().trim().email('Please enter a valid email.'),
    confirmEmail: z.string().trim().email('Please enter a valid confirmation email.'),
    password: z.string().min(1, 'Password is required.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .superRefine((value, ctx) => {
    if (value.email !== value.confirmEmail) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmEmail'],
        message: 'Emails do not match.',
      })
    }

    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      })
    }
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
