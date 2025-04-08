import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { navItems } from '@/data/navItems';
import { LoggedInProvider } from "@/context/loggedIn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P&P Demo",
  description: "A unique system that allows users to log into accounts containing sensitive information by saying or entering a predetermined PIN via telephone.",
  keywords: 'phone, pin, security, authentication',
  authors: [{ name: "Nate Cox" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoggedInProvider>
          <Navbar items={navItems} />
        </LoggedInProvider>
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
          {children}
        </main>
      </body>
    </html>
  );
}
