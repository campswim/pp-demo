'use server'

import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { ZodSchema, ZodError, SafeParseSuccess } from 'zod'
import { ParsedCookieSchema, GenericPayloadSchema, Cookie } from '@/lib/schemata'

export const cookieConfig = async (env: boolean = process.env.NODE_ENV === 'production') => ({
  httpOnly: true,
  path: '/',
  secure: env,
  sameSite: 'lax' as const
})

export const getCookie = async (key: string): Promise<Cookie | null> => {
  if (!key) throw new Error('No key was provided to the cookie getter.')
  const cookieStore = await cookies()
  const cookie = cookieStore.get(key)
  return cookie && cookie.value && typeof cookie.value === 'string' ? cookie : null
}

export const setCookie = async (key: string, value: string): Promise<void> => {
  if (!key || !value) throw new Error('No key and/or value was provided to the cookie setter.')

  const cookieStore = await cookies()

  try {
    cookieStore.set(key, JSON.stringify({ value }), await cookieConfig())
  } catch (err) {
    console.error(`Failed to set the cookie with key of ${key}`, err)
    throw new Error(`Failed to set the cookie with key of ${key}`)
  }
}

export const deleteCookie = async (key: string): Promise<void> => {
  if (!key) throw new Error('No key was provided to the cookie deleter.')
  
  const cookieStore = await cookies()

  try {
    cookieStore.delete(key)
    // cookieStore.delete({ name: key, maxAge: -1, path: '/' })
  } catch (err) {
    console.error(`Failed to delete the cookie with key of ${key}`, err)
    throw new Error(`Failed to delete the cookie with key of ${key}`)
  }
}

export const validateCookieAgainstSchema = async <T>(cookie: Cookie, key: string, schema: ZodSchema<T>): Promise<T | null> => {
  if (!cookie || !cookie.value || typeof cookie.value !== 'string') return null

  const parsed = schema.safeParse(cookie?.value)
  if (!parsed.success) {
    console.warn(`Cookie validation failed for key "${key}":`, parsed.error.flatten())
    return null
  }

  return parsed.data
}

// Parse a cookie and return its value, if it exists.
export const parseCookieValue = async (key: string, token: boolean = false): Promise<Record<string, unknown> | null> => {
  if (!key) throw new Error('No key was provided to parseCookieValue')

  const cookie: Cookie | null = await getCookie(key)
  if (!cookie) return null

  let rawValue: string | null = null

  try {
    const parsedCookie = cookie.value ? ParsedCookieSchema.safeParse(JSON.parse(cookie.value)) : { success: false, error: new Error('Cookie value is undefined') }
    if (!parsedCookie.success) {
      if (parsedCookie.error instanceof ZodError) {
        console.warn('Cookie missing or has an invalid value field.', parsedCookie.error.flatten())
      } else {
        console.warn('Cookie missing or has an invalid value field.', parsedCookie.error)
      }
      return null
    }

    if (!parsedCookie.success) {
      console.warn('Cookie parsing failed.', parsedCookie.error)
      return null
    }
    if (parsedCookie.success) {
      rawValue = (parsedCookie as SafeParseSuccess<{ value: string }>).data.value
      // Proceed with rawValue
    } else {
      return null
    }

    if (token) {
      try {
        const decoded = rawValue ? decodeJwt(rawValue) : null
        const validatedDecoded = GenericPayloadSchema.safeParse(decoded)
        if (!validatedDecoded.success) {
          console.warn('Decoded JWT payload is invalid.', validatedDecoded.error.flatten())
          return null
        }

        return validatedDecoded.data
      } catch (err) {
        console.warn('Failed to decode JWT payload.', err)
        return null
      }
    } else {
      try {
        const parsedValue = rawValue ? JSON.parse(rawValue) : null
        const validatedParsed = GenericPayloadSchema.safeParse(parsedValue)
        if (!validatedParsed.success) {
          console.warn('Parsed plain cookie value is invlaid.', validatedParsed.error.flatten())
          return null
        }

        return validatedParsed.data
      } catch (err) {
        console.warn('Failed to parse non-token cookie value.', err)
        return null
      }
    }
  } catch (err) {
    console.warn('Error parsing or validating the refresh cookie', err)
    return null
  }
}