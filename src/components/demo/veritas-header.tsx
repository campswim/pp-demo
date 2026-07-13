'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { veritasNavItems, veritasAccountNavItems } from '@/data/veritas-nav-items'
import { useLoggedIn } from '@/context/loggedIn'
import { capitalize } from '@/lib/utils'

const NAV_LINK = 'text-base text-[#c8b87a] hover:text-white transition-colors'
const NAV_LINK_ACTIVE = 'border-b border-[#c8b87a]'

export default function VeritasHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { username } = useLoggedIn()

  const isAccountPage = pathname === '/demo/health-care/account'
  // Mid-flow call screens: keep just the logo visible, no nav, matching the banking demo's header.
  const isCallSequencePage = pathname === '/demo/health-care/register-creds' || pathname === '/demo/health-care/start'
  const isLoggedIn = isAccountPage

  const centerItems = isAccountPage ? veritasAccountNavItems : veritasNavItems.filter(({ auth }) => !auth)
  const rightItems  = veritasNavItems.filter(({ name }) => name === 'Log In' || name === 'Log Out')
  const displayName = username ? capitalize(username) : ''

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

          {!isCallSequencePage && (
            <>
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
              <div className="hidden md:flex items-center justify-end gap-4 lg:col-start-3 lg:justify-self-end">
                {isAccountPage ? (
                  <>
                    <div className="text-right leading-tight">
                      <p className="text-sm">
                        <span style={{ color: '#c8b87a' }}>Welcome back, </span>
                        <span className="font-semibold text-white">{displayName}</span>
                      </p>
                      <Link href="/demo/logout" className="text-xs hover:underline" style={{ color: '#9a9aaa' }}>
                        Log Out
                      </Link>
                    </div>
                    <div
                      className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(184,148,58,0.2)' }}
                    >
                      <UserRound size={18} style={{ color: '#b8943a' }} />
                    </div>
                  </>
                ) : (
                  rightItems.map(({ id, name, href }) => {
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
                  })
                )}
              </div>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        {!isCallSequencePage && (
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
                  {isAccountPage ? (
                    <>
                      {veritasAccountNavItems.map(({ id, name, href }) => (
                        <SheetClose asChild key={id}>
                          <Link href={href} className="text-[#c8b87a] hover:text-white">
                            {name}
                          </Link>
                        </SheetClose>
                      ))}
                      <SheetClose asChild>
                        <Link href="/demo/logout" className="text-[#c8b87a] hover:text-white">
                          Log Out
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                    veritasNavItems
                      .filter(({ auth, name }) => !auth || name === 'Log In')
                      .map(({ id, name, href }) => (
                        <SheetClose asChild key={id}>
                          <Link href={href} className="text-[#c8b87a] hover:text-white">
                            {name}
                          </Link>
                        </SheetClose>
                      ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  )
}
