'use server'

import { cookies } from 'next/headers'
import { Cookie } from './types'

const cookieConfig = (env: boolean = process.env.NODE_ENV === 'production') => ({
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
    cookieStore.set(key, JSON.stringify({ value }), cookieConfig())
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
