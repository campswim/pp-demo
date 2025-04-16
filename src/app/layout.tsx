import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { navItems } from '@/data/navItems'
import { LoggedInProvider } from "@/context/loggedIn"
import { cookies } from 'next/headers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "P&P Demo",
  description: "A unique system that allows users to log into accounts containing sensitive information by saying or entering a predetermined PIN via telephone.",
  keywords: 'phone, pin, security, authentication',
  authors: [{ name: "Nate Cox" }],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode}>) {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('auth')  
  const { role = 'guest' } = authCookie && authCookie.value ? JSON.parse(authCookie.value) : {}

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoggedInProvider initialRole={role}>
          <Navbar items={navItems} />
        </LoggedInProvider>
        <main className='flex flex-col w-[90%] m-auto min-h-screen'>
          {children}
        </main>
      </body>
    </html>
  )
}
