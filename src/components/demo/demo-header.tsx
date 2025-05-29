'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { demoNavItems } from '@/data/demo-nav-items'

export default function DemoHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!pathname.startsWith('/demo')) return null

  return (
    <header className='w-full min-h-25 flex items-center border-b bg-blue-100 dark:bg-white/70 backdrop-blur z-50'>
      <div className='w-full lg:max-w-7xl lg:mx-auto p-4 flex justify-evenly items-center'>
        <Link href='/demo' className='text-xl font-bold'>Client Logo</Link>
        <nav className='hidden md:flex justify-center gap-6 col-start-2'>
          {demoNavItems.map(({ id, name, href }) => (
            <Link key={id} href={href} className='text-sm hover:text-primary'>
              {name}
            </Link>
          ))}
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
                {demoNavItems.map(({ id, name, href }) => (
                  <SheetClose asChild key={id}>
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