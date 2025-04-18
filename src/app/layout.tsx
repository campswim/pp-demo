import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { navItems } from '@/data/navItems'
import { LoggedInProvider } from '@/context/loggedIn'
import { validateAuthCookie, validateRefreshCookie } from '@/utils/auth'
import { JWTPayload } from '@/utils/types'
import RefreshSession from '@/components/refreshSession'
import Logout from '@/components/logout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'P&P Demo',
  description: 'A unique system that allows users to log into accounts containing sensitive information by saying or entering a predetermined PIN via telephone.',
  keywords: 'phone, pin, security, authentication',
  authors: [{ name: 'Nate Cox' }],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode}>) {
  // Get the auth cookie -> { valid, payload, reason } 
  const authCookie = await validateAuthCookie()
  let user: JWTPayload | null = null, needsRefresh = false, needsLogout = false

  if (authCookie?.valid === false) { // The auth cookie is invalid.
    if (authCookie?.reason === 'jwt expired') { // The auth cookie has expired.
      // Get the refresh cookie.
      const refreshCookie = await validateRefreshCookie()

      if (refreshCookie?.valid === false) { // The refresh cookie is invalid (probably expired).
        // Log the user out (which deletes the cookies.)
        user = refreshCookie?.payload ? refreshCookie.payload : null
        needsLogout = true
      } else { // The refresh cookie is valid.
        // Compare the IDs of the expired access token and refresh token before refreshing the access token.
        const accessTokenId = authCookie?.payload?.userId
        const refreshTokenId = refreshCookie?.payload?.userId

        if (accessTokenId && refreshTokenId && accessTokenId === refreshTokenId) {
          // Refresh the access token and refresh tokens.
          if (refreshCookie?.payload) {
            needsRefresh = true
            user = refreshCookie.payload
          }
        }
      }
    } else { // The auth cookie is invalid for another reason.
      // Log the user out (which deletes the cookies.)
      user = authCookie?.payload ? authCookie.payload : null
      needsLogout = true
    }
  } else { // The auth cookie is valid.
    user = authCookie?.payload ?? null
  }
  
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoggedInProvider user={user || null}>
          {needsRefresh && user && <RefreshSession payload={user} />}
          {needsLogout && user && <Logout userId={user?.userId} />}
          <Navbar items={navItems} />
          <main className='flex flex-col w-[90%] m-auto min-h-screen'>
            {children}
          </main>
        </LoggedInProvider>
      </body>
    </html>
  )
}
