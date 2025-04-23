'use server'

import { cookies } from 'next/headers'
import { jwtVerify, decodeJwt, type JWTPayload } from 'jose'
import { Cookie } from './types'
import { getSecretKey } from '@/utils/auth'

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
  return cookie ?? null;
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

// Parse a cookie and return its value, if it exists.
export const parseCookieValue = async (name: string): Promise<JWTPayload | null> => {
  const cookie = await getCookie(name)
  const cookieData = cookie?.value
  let payload: JWTPayload | null = null
    
  if (!cookieData) return null
  try {
    const parsed = JSON.parse(cookieData)

    if (!parsed.value) return null

    try {
      const secret = await getSecretKey('refresh')

      if (!secret) return null
      const encoder = new TextEncoder()
      const secretKey = encoder.encode(String(secret))
      const verified = await jwtVerify(parsed.value, secretKey)
      payload = verified?.payload
    } catch (err) {
      console.warn('JWT verification failed, returning unverified payload.', err)
      payload = decodeJwt(parsed.value) as JWTPayload
    }

    // Runtime type guard: check for the expected shape.
    if (typeof payload !== 'object' || !payload || !payload.userId || !payload.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return null
    }

    return payload
  } catch (err) {
    console.warn('Error parsing or validating the refresh cookie', err)
    return null
  }
}