'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { veritasNavItems } from '@/data/veritas-nav-items'

const NAV_LINK = 'text-base text-[#c8b87a] hover:text-white transition-colors'
const NAV_LINK_ACTIVE = 'border-b border-[#c8b87a]'

export default function VeritasHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isLoggedIn = false // login page — always unauthenticated view

  const centerItems = veritasNavItems.filter(({ auth }) => !auth)
  const rightItems  = veritasNavItems.filter(({ name }) => name === 'Log In' || name === 'Log Out')

  return (
    <header
      className="sticky top-0 w-full z-10 border-b"
      style={{
        backgroundColor: '#111827',
        borderBottomColor: 'rgba(90,130,195,0.25)',
      }}
    >
      <div className="w-full px-6 py-3 flex items-center">
        <nav className="relative w-full flex items-center justify-between lg:grid lg:grid-cols-3 lg:items-center">

          {/* Left — Veritas logo */}
          <Link href="/demo/health-care" className="lg:justify-self-start lg:col-start-1 flex items-center">
            <Image
              src="/logos/veritas-logo.svg"
              alt="Veritas Private Health"
              width={160}
              height={60}
              className="h-12 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Center — nav links (desktop) */}
          <div className="hidden md:flex justify-center gap-6 lg:col-start-2">
            {centerItems
              .filter(({ name }) => name !== 'Log In')
              .map(({ id, name, href }) => (
                <Link
                  key={id}
                  href={href}
                  className={`${NAV_LINK} ${pathname === href ? NAV_LINK_ACTIVE : ''}`}
                >
                  {name}
                </Link>
              ))}
          </div>

          {/* Right — auth links (desktop) */}
          <div className="hidden md:flex justify-end gap-4 lg:col-start-3 lg:justify-self-end">
            {rightItems.map(({ id, name, href }) => {
              if (name === 'Log Out' && !isLoggedIn) return null
              if (name === 'Log In' && isLoggedIn) return null
              const isActive = pathname === href ? NAV_LINK_ACTIVE : ''
              return (
                <Link
                  key={id}
                  href={href}
                  className={`${NAV_LINK} ${isActive} px-4 py-1.5 rounded-lg border border-[#b8943a]/50 hover:border-[#b8943a] text-sm`}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden ml-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-[#b8943a]/50 text-[#c8b87a]">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pl-6 pr-4 bg-[#17213e]">
              <SheetTitle className="sr-only">Veritas Menu</SheetTitle>
              <SheetDescription className="sr-only">Veritas Private Health navigation menu.</SheetDescription>
              <div className="mt-8 flex flex-col space-y-4">
                {veritasNavItems
                  .filter(({ auth, name }) => !auth || name === 'Log In')
                  .map(({ id, name, href }) => (
                    <SheetClose asChild key={id}>
                      <Link href={href} className="text-[#c8b87a] hover:text-white">
                        {name}
                      </Link>
                    </SheetClose>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
