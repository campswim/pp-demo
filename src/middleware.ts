import { NextResponse } from 'next/server'
import { type JWTPayload } from 'jose'
import { validateAuthCookie, validateRefreshCookie, refreshAccessToken, refreshRefreshToken } from '@/utils/auth'
import { parseCookieValue, cookieConfig } from '@/utils/cookie'

export async function middleware() {
  const authCookie: JWTPayload | null = await validateAuthCookie()
  const response = NextResponse.next()

  if (!authCookie) {
    console.warn('The auth cookie is invalid.')
    // Attempt to refresh the access token.
    const refreshCookie: JWTPayload | null = await validateRefreshCookie()

    if (!refreshCookie) {
      console.warn('The refresh cookie is invalid.')

      // Get the user ID.
      const parsed = await parseCookieValue('auth')
      const userId: string | null = typeof parsed?.userId === 'string' ? parsed.userId : null

      // Delete the auth and refresh cookies.
      response.cookies.delete('auth')
      response.cookies.delete('refresh')
      
      // Pass the user ID to frontend.
      if (userId) response.headers.set('user-id', userId)  

      return response
    } 
    
    // Refresh the access and refresh tokens.
    const newAccessToken = await refreshAccessToken(refreshCookie)
    const newRefreshToken = await refreshRefreshToken(refreshCookie)

    if (newAccessToken && newRefreshToken) {
      response.cookies.set('auth', newAccessToken, await cookieConfig())
      response.cookies.set('refresh', newRefreshToken, await cookieConfig())
    }
  }

  return response
}

export const config = {
  matcher: '/((?!_next|images|favicon.ico|api).*)' // Skip static routes and allow everything else.
}