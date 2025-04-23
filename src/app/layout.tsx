import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { navItems } from '@/data/navItems'
import { LoggedInProvider } from '@/context/loggedIn'
import { validateAuthCookie } from '@/utils/auth'
import { getCookie } from '@/utils/cookie'

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
  const user = await validateAuthCookie()

  // Mark the user as logged out in the database.
  if (!user) {
    const cookie = await getCookie('user-id')
    const expiredUserId = cookie?.value

    if (expiredUserId) {
      fetch('/api/logout', {
        method: 'POST',
        body: JSON.stringify({ expiredUserId }),
      })
    }
  }
  
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoggedInProvider user={user || null}>
          {/* {needsRefresh && user && <RefreshSession payload={user} />}
          {needsLogout && user && <Logout userId={user?.userId} />} */}
          <Navbar items={navItems} />
          <main className='flex flex-col w-[90%] m-auto min-h-screen'>
            {children}
          </main>
        </LoggedInProvider>
      </body>
    </html>
  )
}
