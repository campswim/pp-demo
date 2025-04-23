'use server'

// import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { getCookie, setCookie } from '@/utils/cookie'

export const getSecretKey = async (type: string): Promise<Uint8Array> => {
  const secret = type === 'access' 
    ? process.env.ACCESS_SECRET 
    : type === 'refresh' 
    ? process.env.REFRESH_SECRET 
    : ''
  
  if (!secret) throw new Error(`${type.toUpperCase()}_SECRET is not defined.`)

  return new TextEncoder().encode(secret)  // jose expects Uint8Array for HS256
}

export const generateAccessToken = async (payload: JWTPayload): Promise<string> => {
  const secret = await getSecretKey('access')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15s')
    .sign(secret)
}

export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => {
  const secret = await getSecretKey('refresh')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

// Refresh the access token, when the refresh token is still active.
export const refreshAccessToken = async (refreshToken: JWTPayload): Promise<string | null> => {
  if (!refreshToken) return null

  try {
    const payload: JWTPayload = {
      userId: refreshToken?.userId,
      email: refreshToken?.email,
      role: refreshToken?.role
    }
    const newAccessToken = await generateAccessToken(payload)

    if (newAccessToken) {
      await setCookie('auth', newAccessToken)
      return newAccessToken
    } else return null
  } catch (err) {
    console.warn('Error in the refreshAccessToken function: ', err)
    return null
  }
}

// Refresh the refresh token, when a user logs in.
export const refreshRefreshToken = async (refreshToken: JWTPayload): Promise<string | null> => {
  if (!refreshToken) return null

  const payload: JWTPayload = {
    userId: refreshToken?.userId,
    email: refreshToken?.email,
    role: refreshToken?.role
  }

  try {
    const newRefreshToken = await generateRefreshToken(payload)

    if (newRefreshToken) {
      await setCookie('refresh', newRefreshToken)
      return newRefreshToken
    } else return null
  } catch (err) {
    console.warn('Error in the refreshRefreshToken function: ', err)
    return null
  }
}

// Validate the auth cookie, set on sign-up or log-in.
export const validateAuthCookie = async (): Promise<JWTPayload | null> => {
  const authCookie = await getCookie('auth')
  const accessToken = authCookie?.value

  if (!accessToken) return null

  try {
    const secret = await getSecretKey('access')
    if (!secret) return null

    const { payload } = await jwtVerify(accessToken, secret)

    // Runtime type guard: check for the expected shape.
    if (!payload || typeof payload !== 'object' || !payload.userId || !payload.email) {
      console.warn('The decoded JWT is missing expected properties.')
      return null
    }

    return payload
  } catch (err) {
    console.warn('Error parsing or validating the auth cookie.', err)
    return null
  }
}

// Validate the refresh cookie, set on sign-up or log-in.
export const validateRefreshCookie = async (): Promise<JWTPayload | null> => {
  const refreshCookie = await getCookie('refresh')
  const refreshData = refreshCookie?.value

  // if (!refreshData) return { valid: false, reason: 'missing' }
  if (!refreshData) return null

    try {
    const parsed = JSON.parse(refreshData)

    if (!parsed.value) return null

    const secret = await getSecretKey('refresh')
    if (!secret) return null

    const { payload } = await jwtVerify(parsed.value, secret)

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
