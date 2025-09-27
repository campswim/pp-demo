import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LoggedInProvider } from '@/context/loggedIn'
import { ThemeProvider } from '@/context/theme'
import { getUserSession } from '@/utils/userActions'
import SplitLayout from '@/components/ui/split-layout'

// Body & UI font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

// Headings font
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'P&P Demo',
  description:
    'A unique system that allows users to log into accounts containing sensitive information by saying or entering a predetermined PIN via telephone.',
  keywords: 'phone, pin, security, authentication',
  authors: [{ name: 'Nate Cox' }],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserSession()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <LoggedInProvider user={user || null}>
            <SplitLayout>{children}</SplitLayout>
          </LoggedInProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}