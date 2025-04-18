'use server'

import jwt from 'jsonwebtoken'
import { JWTPayload, ValidationResult } from './types'
import { getCookie, setCookie } from '@/utils/cookie'

const getSecretKey = (type: string): string => {
  const secret = type === 'access' ? process.env.JWT_SECRET : type === 'refresh' ? process.env.REFRESH_SECRET : ''
  if (!secret) throw new Error('JWT_SECRET is not defined.')
  return secret
}

export const generateAccessToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('access'), { expiresIn: '15s' })

export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => jwt.sign(payload, getSecretKey('refresh'), { expiresIn: '30d' })

// Validate the auth cookie, set on sign-up or log-in.
export const validateAuthCookie = async (): Promise<ValidationResult> => {
  const authCookie = await getCookie('auth')
  const authData = authCookie?.value

  if (!authData) return { valid: false, reason: 'missing' }

  try {
    const parsed = JSON.parse(authData)

    if (!parsed.value) return { valid: false, reason: 'invalid' }

    const secret = getSecretKey('access')
    const decoded = jwt.decode(parsed.value) as unknown as JWTPayload

    // Runtime type guard: check for the expected shape.
    if (typeof decoded !== 'object' || !decoded || !decoded.userId || !decoded.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return { valid: false, reason: 'invalid' }
    }

    try {
      jwt.verify(parsed.value, secret)
      return { valid: true, payload: decoded }
    } catch (err) {
      console.warn('validateAuthCookie inner catch block: ', err)
      return { 
        valid: false,
        payload: decoded,
        reason: err instanceof Error ? err.message : 'Unknown error in validateAuthCookie.' 
      }
    }
  } catch (err) {
    console.warn('validateAuthCookie catch block: ', err)
    return { 
      valid: false, 
      reason: err instanceof Error ? err.message : 'Unknown error in validateAuthCookie.' }
  }
}

// Validate the refresh cookie, set on sign-up or log-in.
export const validateRefreshCookie = async (): Promise<ValidationResult> => {
  const refreshCookie = await getCookie('refresh')
  const refreshData = refreshCookie?.value

  if (!refreshData) return { valid: false, reason: 'missing' }

  try {
    const parsed = JSON.parse(refreshData)

    if (!parsed.value) return { valid: false, reason: 'invalid' }

    const secret = getSecretKey('refresh')
    const decoded = jwt.verify(parsed.value, secret) as unknown as JWTPayload

    // Runtime type guard: check for the expected shape.
    if (typeof decoded !== 'object' || !decoded || !decoded.userId || !decoded.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return { valid: false, reason: 'invalid' }
    }

    return { valid: true, payload: decoded }
  } catch (err) {
    console.warn('validateRefreshCookie catch block: ', err)
    return { 
      valid: false, 
      reason: err instanceof Error ? err.message : 'Unknown error in validateRefreshCookie.' 
    }
  }
}

// Refresh the access token, when the refresh token is still active.
export const refreshAccessToken = async (refreshToken: JWTPayload): Promise<void> => {
  try {
    const payload: JWTPayload = {
      userId: refreshToken?.userId,
      email: refreshToken?.email,
      role: refreshToken?.role
    }
    const newAccessToken = await generateAccessToken(payload)

    if (newAccessToken) {
      // Set the new access token as a cookie.
      await setCookie('auth', newAccessToken)
    }
  } catch (err) {
    console.warn('Error in the refreshAccessToken function: ', err)
  }
}

// Refresh the refresh token, when a user logs in.
export const refreshRefreshToken = async (refreshToken: JWTPayload): Promise<void> => {
  const payload: JWTPayload = {
    userId: refreshToken?.userId,
    email: refreshToken?.email,
    role: refreshToken?.role
  }

  try {
    const newRefreshToken = await generateRefreshToken(payload)

    if (newRefreshToken) await setCookie('refresh', newRefreshToken)
  } catch (err) {
    console.warn('Error in the refreshRefreshToken function: ', err)
  }
}