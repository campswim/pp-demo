'use client'

import Logo from '@/components/navbar/logo'
import { usePathname } from 'next/navigation'

export default function LogoBackground() {
  const pathname = usePathname()

  if (pathname.startsWith('/demo')) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center opacity-7 pointer-events-none z-0 overflow-hidden'>
      <Logo />
    </div>
  )
}