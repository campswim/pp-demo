import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/navbar'
import { LoggedInProvider } from '@/context/loggedIn'
import { ThemeProvider } from '@/context/theme'
import { getUserSession } from '@/utils/userActions'
import Container from '@/components/global/Container'

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
  const user = await getUserSession()
  
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoggedInProvider user={user || null}>
            {/* {needsRefresh && user && <RefreshSession payload={user} />}
            {needsLogout && user && <Logout userId={user?.userId} />} */}
            <Navbar />
            <Container>
              <main className='flex flex-col min-h-screen'>
                {children}
              </main>
            </Container>
          </LoggedInProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
