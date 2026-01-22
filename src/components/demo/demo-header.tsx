'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { demoNavItems } from '@/data/demo-nav-items'

export default function DemoHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const shouldShowNavItem = (href: string) => {
    // On landing page: hide everything but Log In.
    if (pathname === '/demo/landing-page') {
      if (href !== '/demo/login') return false
      return true
    }

    // On log-in page: hide Register & Log Out.
    if (pathname === '/demo/login') {
      if (href === '/demo/register-creds' || href === '/demo/logout') return false
      return true
    }

    // On register page: hide Login.
    if (pathname === '/demo/register-creds') {
      if (href === '/demo/login') return false
      return true
    }

    // On account page: hide log-in & register.
    if (pathname === '/demo/account') {
      if (href === '/demo/login' || href === '/demo/register-creds') return false
      return true
    }

    // Default: show everything.
    return true
  }
  
  if (!pathname.startsWith('/demo')) return null

  return (
    <header className='fixed inset-x-0 w-full min-h-15 lg:min-h-25 flex items-center border-b bg-gradient-to-r from-[#1e3a6a] to-[#173054] backdrop-blur z-50'>
      <div className='w-full p-4 flex items-center'>
        <nav className='relative w-full flex flex-col items-start sm:flex-row sm:items-center sm:justify-between lg:grid lg:grid-cols-3 lg:items-center py-4 xs:py-0'>
          <Link href='/demo/landing-page' className='text-xl font-bold lg:justify-self-start lg:col-start-1'>
            <Image 
              src='/logos/Fortress_Demo_3-removebg-preview.png'
              alt='Fortress Demo Logo'
              width={373}
              height={237}
              className="w-30 h-auto"
            />
          </Link>
          <div className="flex justify-center gap-6 lg:col-start-2">
            {demoNavItems
              .filter(({ name, auth }) => {
                if (pathname === '/demo/account') {
                  return auth && name !== 'Log In' && name !== 'Log Out' && name !== 'Profile'
                }
                return true 
              })
              .map(({ id, name, href }) => {
                if (!shouldShowNavItem(href)) return null
                const isActive = pathname === href ? 'border-b-2 border-white' : ''
                return (
                  <Link key={id} href={href} className={`text-xl text-white hover:text-primary ${isActive}`}>
                    {name}
                  </Link>
                )
              })}
          </div>

          <div className="flex justify-end gap-6 lg:col-start-3 lg:justify-self-end">
            {demoNavItems
              .filter(({ name }) => {
                return name === 'Log In' || name === 'Log Out' || name === 'Profile'
              })
              .map(({ id, name, href }) => {
                if (!shouldShowNavItem(href)) return null
                const isActive = pathname === href ? 'border-b-2 border-white' : ''
                return (
                  <Link key={id} href={href} className={`text-xl text-white hover:text-primary ${isActive}`}>
                    {name}
                  </Link>
                )
              })}
          </div>
        </nav>
        <div className='md:hidden'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='sm'>☰</Button>
            </SheetTrigger>
            <SheetContent side='right' className='pl-6 pr-4'>
              <SheetTitle className='sr-only'>Demo Menu</SheetTitle>
              <SheetDescription className='sr-only'>This is the demo navigation menu.</SheetDescription>
              <div className='mt-8 flex flex-col space-y-4'>
                {demoNavItems.map(({ id, name, href, auth }) => {
                  if (pathname === '/demo/account' && !auth) return null

                  if (!shouldShowNavItem(href)) return null

                  return (
                    <SheetClose asChild key={id}>
                      <Link href={href}>{name}</Link>
                    </SheetClose>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>      
      </div>
    </header>
  )
}