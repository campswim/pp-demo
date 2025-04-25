import { NextResponse } from 'next/server'
import type { JWTPayload } from 'jose'
import { validateAuthCookie, validateRefreshCookie, refreshAccessToken, refreshRefreshToken } from '@/utils/auth'
import { parseCookieValue, cookieConfig } from '@/utils/cookie'

export async function middleware() {
  console.log('----------- Middleware Start ----------------')

  // Get the auth cookie of the logged-in user, if it exists.
  const authCookie: JWTPayload | null = await validateAuthCookie()
  const response = NextResponse.next()

  console.log({authCookie})

  // If the authCookie does not exist or has expired, try to refresh the access token with the refresh cookie.
  if (!authCookie) {
    // Get the refresh cookie.
    const refreshCookie: JWTPayload | null = await validateRefreshCookie()

    console.log({refreshCookie})

    // If there is no refresh token or it has expired, clear the auth and refresh cookies and set the expired user ID in cookies for use in toggling the loggedIn value in the DB for the user.
    if (!refreshCookie) {
      // Get the user ID.
      const parsed = await parseCookieValue('auth', true)

      console.log('Old cookie: ', {parsed})

      const expiredUserId: string | null = parsed && typeof parsed?.userId === 'string' ? parsed.userId : null

      console.log({expiredUserId})

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
    const newAccessToken = await refreshAccessToken(refreshCookie)
    const newRefreshToken = await refreshRefreshToken(refreshCookie)

    // // Delete the expired user ID.
    // response.cookies.delete('user-id')

    console.log({newAccessToken, newRefreshToken})

    if (newAccessToken && newRefreshToken) {
      response.cookies.set('auth', JSON.stringify({ value: newAccessToken }), await cookieConfig())
      response.cookies.set('refresh', JSON.stringify({ value: newRefreshToken}), await cookieConfig())
    }
  }

  console.log('----------- Middleware End ----------------')

  return response
}

export const config = {
  matcher: '/((?!_next|images|favicon.ico|api).*)' // Skip static routes and allow everything else.
}