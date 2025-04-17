import { cookies } from 'next/headers'
import jwt, {JwtPayload } from 'jsonwebtoken'

interface JWTPayload extends JwtPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

const getSecretKey = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined.')
  return secret
}

export async function validateAuthCookie(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const authData = cookieStore.get('auth')?.value

  if (!authData) return null

  try {
    const parsed = JSON.parse(authData)
    if (!parsed.token) return null

    const decoded = jwt.verify(parsed.token, getSecretKey()) as JWTPayload

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