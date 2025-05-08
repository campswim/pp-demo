import { z } from 'zod'
 
export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Your username must be at least 2 characters long.' })
    .trim(),
  // email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(5, { message: 'be at least 5 characters long.' })
    // .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    // .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
  })

export const SignupFormSchema = LoginFormSchema.extend({
    phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, {
      message: 'Please enter a valid phone number.',
    })
})

export const DemoSignupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Your username must be at least 2 characters long.' })
    .trim(),
  // email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(5, { message: 'be at least 5 characters long.' })
})
 
export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
        phone?: string[]
      }
      message?: string
      user?: {
        id?: string
        username?: string
        role?: string
        token?: string
      }
    }
  | undefined

export const CookieSchema = z.object({
  value: z.string().optional(),
  expires: z.number().optional()
})

export type Cookie = z.infer<typeof CookieSchema>

// 1a. Create a schema for the inner JWT payload.
export const JWTPayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  // email: z.string(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional()
})

// 1b. Export the TS type based on the schema.
export type JWTPayload = z.infer<typeof JWTPayloadSchema>

// 2. Create a schema for the JSON cookie itself.
export const AuthCookieSchema = z.string().transform((val, ctx) => {
  try {
    const parsed = JSON.parse(val)
    if (!parsed.value || typeof parsed.value !== 'string') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Missing the value field in the cookie.'
      })
      return z.NEVER
    }
    return parsed.value
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid JSON in the cookie.'
    })
    return z.NEVER
  }
})

// The outer cookie shape.
export const ParsedCookieSchema = z.object({ value: z.string() })

// The generic shape of the cookie's inner object (accepts any object).
export const GenericPayloadSchema = z.record(z.unknown())