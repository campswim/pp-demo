'use client'

import { usePathname } from 'next/navigation'

export default function DemoBackground() {
  const pathname = usePathname()

  if (!pathname.startsWith('/demo')) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0'>
      <p className='hidden xs:block xs:text-[40vw]'>DEMO</p>    
    </div>
  )
}