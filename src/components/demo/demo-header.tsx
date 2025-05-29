'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { demoNavItems } from '@/data/demo-nav-items'

export default function DemoHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!pathname.startsWith('/demo')) return null

  return (
    <header className='w-full border-b bg-white/70 backdrop-blur z-50'>
      <div className='max-w-7xl mx-auto p-4 flex justify-evenly items-center'>
        <Link href='/demo' className='text-xl font-bold'>Client Logo</Link>
        <nav className='hidden md:flex justify-center gap-6 col-start-2'>
          {demoNavItems.map(({ name, href }) => (
            <Link key={name} href={href} className='text-sm hover:text-primary'>
              {name}
            </Link>
          ))}
        </nav>
        <div className='md:hidden'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='sm'>☰</Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <div className='mt-8 flex flex-col space-y-4'>
                {demoNavItems.map(({ name, href }) => (
                  <SheetClose asChild key={href}>
                    <Link href={href}>{name}</Link>
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