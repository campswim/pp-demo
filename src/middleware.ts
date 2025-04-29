import { NextRequest, NextResponse } from 'next/server'
import { JWTPayload } from '@/lib/schemata'
import { Cookie } from '@/lib/schemata'
import { validateAuthCookie, validateRefreshCookie, refreshAccessToken, refreshRefreshToken } from '@/utils/auth'
import { parseCookieValue, cookieConfig } from '@/utils/cookie'

export async function middleware(request: NextRequest) {
  // Get the auth cookie of the logged-in user, if it exists.
  const authCookie: Cookie | null = request.cookies.get('auth') ?? null
  const authCookieAuthenticated: JWTPayload | null = authCookie ? await validateAuthCookie(authCookie) : null
  const response = NextResponse.next()

  // If the authCookie does not exist or has expired, try to refresh the access token with the refresh cookie.
  if (!authCookieAuthenticated) {
    // Get the refresh cookie.
    const refreshCookie: Cookie | null = request.cookies.get('refresh') ?? null
    const refreshCookieAuthenticated: JWTPayload | null = refreshCookie ? await validateRefreshCookie(refreshCookie) : null

    // If there is no refresh token or it has expired, clear the auth and refresh cookies and set the expired user ID in cookies for use in toggling the loggedIn value in the DB for the user.
    if (!refreshCookieAuthenticated) {
      // Get the user ID.
      const parsed = await parseCookieValue('auth', true)
      const expiredUserId: string | null = parsed && typeof parsed?.userId === 'string' ? parsed.userId : null

      // Delete the auth and refresh cookies.
      response.cookies.delete('auth')
      response.cookies.delete('refresh')
      
      // Pass the user ID to frontend: cookie or header?
      if (expiredUserId) {
        response.cookies.set('user-id', expiredUserId)
      }

      return response
    }
    
    // If the refresh token is valid, refresh the access and refresh tokens.
    const newAccessToken = await refreshAccessToken(refreshCookieAuthenticated)
    const newRefreshToken = await refreshRefreshToken(refreshCookieAuthenticated)

    if (newAccessToken && newRefreshToken) {
      response.cookies.set('auth', JSON.stringify({ value: newAccessToken }), await cookieConfig())
      response.cookies.set('refresh', JSON.stringify({ value: newRefreshToken}), await cookieConfig())
    }
  }

  return response
}

export const config = {
  matcher: '/((?!_next|images|favicon.ico|api).*)' // Skip static routes and allow everything else.
}