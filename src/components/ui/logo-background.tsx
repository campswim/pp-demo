'use client'

import Logo from '@/components/navbar/logo'
import { usePathname } from 'next/navigation'

export default function LogoBackground() {
  const pathname = usePathname()

  console.log({pathname})
  
  if (pathname.startsWith('/demo') || pathname === '/') return null

  return (
    <div className='fixed inset-0 flex items-center justify-center opacity-50 pointer-events-none z-0 overflow-hidden'>
      <Logo />
    </div>
  )
}