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
    if (pathname === '/demo/landing-page') {
      // On landing page: hide everything but Log In.
      if (href !== '/demo/login') return false
      return true
    }

    if (pathname === '/demo/login') {
      // On login page: hide Register & Log Out.
      if (href === '/demo/register-creds' || href === '/demo/logout') return false
      return true
    }

    if (pathname === '/demo/register-creds') {
      // On register page: hide Login
      if (href === '/demo/login') return false
      return true
    }

    if (pathname === '/demo/account') {
      // On account page: hide Login & Register
      if (href === '/demo/login' || href === '/demo/register-creds') return false
      return true
    }

    // Default: show everything
    return true
  }
  
  if (!pathname.startsWith('/demo')) return null

  return (
    <header className='fixed w-full min-h-15 lg:min-h-25 flex items-center border-b bg-gradient-to-r from-[#1e3a6a] to-[#173054] backdrop-blur z-50'>
      <div className='w-full lg:max-w-7xl lg:mx-auto p-4 flex justify-center items-center'>
        <Link href='/demo/login' className='text-xl font-bold mx-16'>
          <Image 
            src='/logos/Fortress_Demo_3-removebg-preview.png'
            alt='Fortress Demo Logo'
            width={373}
            height={237}
            className="w-30 h-auto"
          />
        </Link>
        <nav className='hidden md:flex justify-center gap-6 col-start-2'>
          {demoNavItems.map(({ id, name, href }) => {            
            if (!shouldShowNavItem(href)) return null
            const isActive = pathname === href ? 'border-b-2 border-blue-500' : ''
            
            return (
            <Link key={id} href={href} className={`text-xl text-white hover:text-primary ${isActive}`}>
              {name}
            </Link>
          )})}
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
                {demoNavItems.map(({ id, name, href }) => {
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