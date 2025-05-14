'use client'

import { useState, useRef, useEffect } from 'react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import Container from '@/components/global/container'
import Navbar from '@/components/navbar/navbar'

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [open])

  return (
    <>
      {/* Drawer toggle button */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
              className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-transparent p-0 border-none'
              aria-label='Open drawer'
            >
            <div
              className='bg-sky-200 h-2 w-[100px] rounded-full transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-sky-300 dark:bg-sky-800 dark:hover:bg-sky-700'
            />
          </button>        
        </DrawerTrigger>

        {/* Drawer content */}
        <DrawerContent 
          ref={drawerRef}
          tabIndex={-1}
          className='bg-gray-900 text-white p-4 w-screen max-w-none outline-none'
        >
          <Navbar />
        </DrawerContent>
      </Drawer>

      {/* Main content area */}
      <div className='flex h-screen overflow-hidden'>
        <Container>
          <main className='flex flex-col min-h-screen'>
            {children}
          </main>
        </Container>
      </div>
      </>
  )
}