import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  // name: z
  //   .string()
  //   .min(2, { message: 'Name must be at least 2 characters long.' })
  //   .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(5, { message: 'Be at least 8 characters long' })
    // .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    // .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
})
 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
      user?: {
        id?: string
        email?: string
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
  email: z.string(),
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

// generic inner object shape (losse: accepts any object).
export const GenericPayloadSchema = z.record(z.unknown())