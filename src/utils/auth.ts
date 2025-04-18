'use server'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JWTPayload, ValidationResult } from './types'

const getSecretKey = (type: string): string => {
  const secret = type === 'access' ? process.env.JWT_SECRET : type === 'refresh' ? process.env.REFRESH_SECRET : ''
  if (!secret) throw new Error('JWT_SECRET is not defined.')
  return secret
}

export const generateAccessToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('access'), { expiresIn: '1h' })

export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('refresh'), { expiresIn: '30d' })

export const validateAuthCookie = async (): Promise<ValidationResult> => {
  const cookieStore = await cookies()
  const authData = cookieStore.get('auth')?.value

  if (!authData) return { valid: false, reason: 'missing' }

  try {
    const parsed = JSON.parse(authData)

    if (!parsed.value) return { valid: false, reason: 'invalid' }

    const secret = getSecretKey('access')
    const decoded = jwt.verify(parsed.value, secret) as unknown as JWTPayload

    // Runtime type guard: check for the expected shape.
    if (typeof decoded !== 'object' || !decoded || !decoded.userId || !decoded.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return { valid: false, reason: 'invalid' }
    }

    return { valid: true, payload: decoded }

  } catch (err) {
    console.warn('validateAuthCookie catch block: ', err)
    return { valid: false, reason: err instanceof Error ? err.message : 'Unknown error in validateAuthCookie.' }
  }
}