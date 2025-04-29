'use server'

// import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify } from 'jose'
import { JWTPayloadSchema, JWTPayload,  AuthCookieSchema } from '@/lib/schemata'
import type { Cookie } from '@/lib/schemata'
import { validateCookieAgainstSchema } from '@/utils/cookie'

type CodeError = Error & { code?: string }

export const getSecretKey = async (type: string): Promise<Uint8Array> => {
  const secret = type === 'auth' 
    ? process.env.ACCESS_SECRET 
    : type === 'refresh' 
    ? process.env.REFRESH_SECRET 
    : ''
  
  if (!secret) throw new Error(`${type.toUpperCase()}_SECRET is not defined.`)

  return new TextEncoder().encode(secret)  // jose expects Uint8Array for HS256
}

export const generateAccessToken = async (payload: JWTPayload): Promise<string> => {
  const secret = await getSecretKey('auth')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // -> production setting = 1h
    .sign(secret)
}

export const generateRefreshToken = async (payload: JWTPayload): Promise<string> => {  
  const secret = await getSecretKey('refresh')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // -> production setting = 30d
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
    return newAccessToken ?? null
  } catch (err) {
    console.warn('Error in the refresh-access-token function: ', err)
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
    return newRefreshToken ?? null
  } catch (err) {
    console.warn('Error in the refreshRefreshToken function: ', err)
    return null
  }
}

// Validate the auth cookie, set on sign-up or log-in.
export const validateAuthCookie = async (cookie: Cookie | null = null): Promise<JWTPayload | null> => {
  const accessToken = cookie ? await validateCookieAgainstSchema(cookie, 'auth', AuthCookieSchema) : null
  if (!accessToken) return null

  // Get the secret for JTW verification.
  const secret = await getSecretKey('auth')
  if (!secret) {
    console.warn('No secret returned by getSecretKey.')
    return null
  }

  try {
    // Verify the access token.
    const { payload } = await jwtVerify(accessToken, secret)
  
    // Check the payload against a Zod shema.
    const parsedPayload = JWTPayloadSchema.safeParse(payload)
    if (!parsedPayload.success) {
      console.warn('Invalid JWT payload:', parsedPayload.error.flatten())
      return null
    }

    return parsedPayload.data
  } catch (err) {
    const error = err as CodeError
    console.warn('Error parsing or validating the auth cookie:', error.code)
    return null
  }
}

export const validateRefreshCookie = async (cookie: Cookie | null = null): Promise<JWTPayload | null> => {  
  const refreshToken = cookie ? await validateCookieAgainstSchema(cookie, 'refresh', AuthCookieSchema) : null
  if (!refreshToken) return null

  // Get the secret for JTW verification.
  const secret = await getSecretKey('refresh')
  if (!secret) {
    console.warn('No secret returned by getSecretKey.')
    return null
  }

  try {
    // Verify the refresh token.
    const { payload } = await jwtVerify(refreshToken, secret)

    // Check the payload against a Zod schema.
    const parsedPayload = JWTPayloadSchema.safeParse(payload)
    if (!parsedPayload.success) {
      console.warn('Invalid JWT payload:', parsedPayload.error.flatten())
      return null
    }

    return parsedPayload.data
  } catch (err) {
    const error = err as CodeError
    console.warn('Error parsing or validating the refresh cookie:', error.code)
    return null
  }
}

// // Validate the auth cookie, set on sign-up or log-in. [Not in use: see the eponymous version, which uses Zod to parse.]
// export const validateAuthCookie = async (): Promise<JWTPayload | null> => {
//   const authCookie = await getCookie('auth')
//   const accessToken = authCookie?.value

//   if (!accessToken) return null

//   try {
//     const parsed = JSON.parse(accessToken)
//     if (!parsed.value) return null

//     const secret = await getSecretKey('auth')
//     if (!secret) return null

//     const { payload } = await jwtVerify(parsed.value, secret)
//     const result = JWTPayloadSchema.safeParse(payload)

//     if (!result.success) {
//       console.warn('The decode JWT is invalid:', result.error)
//       return null
//     }

//     return result.data
//   } catch (err) {
//     const error = err as CodeError
//     console.warn('Error parsing or validating the auth cookie: ', error.code)
//     return null
//   }
// }

// // Validate the refresh cookie, set on sign-up or log-in. [Not in use: see the eponymous version, which uses Zod to parse.]
// export const validateRefreshCookie = async (): Promise<JWTPayload | null> => {
//   const refreshCookie = await getCookie('refresh')
//   const refreshData = refreshCookie?.value

//   if (!refreshData || !refreshData.value) return null

//   try {
//     const parsed = JSON.parse(refreshData)
//     if (!parsed.value) return null

//     const secret = await getSecretKey('refresh')
//     if (!secret) return null

//     const { payload } = await jwtVerify(parsed.value, secret)
//     const result = JWTPayloadSchema.safeParse(payload)

//     if (!result.success) {
//       console.warn('The decode JWT is invalid:', result.error)
//       return null
//     }

//     return result.data
//   } catch (err) {
//     const error = err as CodeError
//     console.warn('Error parsing or validating the refresh cookie: ', error.code)
//     return null
//   }
// }
