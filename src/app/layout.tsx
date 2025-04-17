import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { navItems } from '@/data/navItems'
import { LoggedInProvider } from "@/context/loggedIn"
import { validateAuthCookie } from '@/utils/auth'

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
  const user = await validateAuthCookie()
    
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoggedInProvider user={user}>
          <Navbar items={navItems} />
          <main className='flex flex-col w-[90%] m-auto min-h-screen'>
            {children}
          </main>
        </LoggedInProvider>
      </body>
    </html>
  )
}
