'use server'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JWTPayload } from './types'

const getSecretKey = (type: string): string => {
  const secret = type === 'access' ? process.env.JWT_SECRET : type === 'refresh' ? process.env.REFRESH_SECRET : ''
  if (!secret) throw new Error('JWT_SECRET is not defined.')
  return secret
}

export const generateAccessToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('access'), { expiresIn: '1h' })

export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('refresh'), { expiresIn: '30d' })

export const validateAuthCookie = async (): Promise<JWTPayload | null> => {
  const cookieStore = await cookies()
  const authData = cookieStore.get('auth')?.value

  if (!authData) return null

  try {
    const parsed = JSON.parse(authData)

    if (!parsed.value) return null

    const secret = getSecretKey('access')
    const decoded = jwt.verify(parsed.value, secret) as unknown as JWTPayload

    // Runtime type guard: check for the expected shape.
    if (typeof decoded !== 'object' || !decoded || !decoded.userId || !decoded.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return null
    }

    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      console.warn('Token has expired.')
      return null
    }

    return decoded as JWTPayload

  } catch (err) {
    console.error('Auth validation error:', err)
    return null
  }
}