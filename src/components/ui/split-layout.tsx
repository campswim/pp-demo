'use client'

import { useState, useEffect, useRef } from 'react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Container from '@/components/global/container'
import Navbar from '@/components/navbar/navbar'
import DemoHeader from '@/components/demo/demo-header'

const ANIMATION_DURATION = 700

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPersistent = !pathname.startsWith('/demo')
  const firstRender = useRef(true)

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(isPersistent)
  const [animatingIn, setAnimatingIn] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)

  // Set the visibiilty of the persistent drawer.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      if (isPersistent) setVisible(true)
      return
    }

    if (isPersistent) {
      setVisible(true)
      setAnimatingIn(true)
      const inTimer = setTimeout(() => setAnimatingIn(false), ANIMATION_DURATION)
      return () => clearTimeout(inTimer)
    } else {
      setAnimatingOut(true)
      const outTimer = setTimeout(() => {
        setAnimatingOut(false)
        setVisible(false)
      }, ANIMATION_DURATION)
      return () => clearTimeout(outTimer)
    }
  }, [isPersistent])

  useEffect(() => {
    if (isPersistent) setOpen(false)
  }, [isPersistent])

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Persistent drawer (not ShadCN) */}
      {visible && (
        <div 
          className={pathname !== '/' ? cn(
            'fixed bottom-0 inset-x-0 z-50 bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 border-t border-gray-700 transition-transform duration-700 ease-in-out',
            animatingIn && 'translate-y-full',
            animatingOut && 'translate-y-full',
            !animatingIn && !animatingOut && 'translate-y-0'
          ) : 'static inset-x-0 z-50 bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 border-b border-gray-700 transition-transform duration-700 ease-in-out'}        
        >
          <Navbar isDrawer={false} />
        </div>
      )}

      {/* ShadCN Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
      {!isPersistent && (
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
      )}

        {/* Drawer content */}
        <DrawerContent 
          className='bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 w-screen max-w-none outline-none'
        >
          <Navbar isDrawer={true}/>
        </DrawerContent>
      </Drawer>

      {/* Main content area */}
      {pathname !== '/' && pathname !== '/user/home' ? (
        <>
          <DemoHeader />
          <Container>
            <main className='flex flex-col flex-1 items-center justify-center'>
              {children}
            </main>
          </Container>
        </>
      )
      :
      (
        <main className='flex flex-col flex-1 items-center justify-center'>
          {children}
        </main>
      )}
    </div>
  )
}