'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLoggedIn } from '@/context/loggedIn'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import logoWhite from '../../../public/logos/Fortress-white-text.png'
import logoBlack from '../../../public/logos/Fortress-dark-text.png'

const Logo: React.FC<{ hrefBoolean?: boolean; caller?: string }> = ({ hrefBoolean = false, caller = null }) => {
  const { role } = useLoggedIn()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const href = role !== 'guest' ? '/user/home' : '/'
  const currentLogo = resolvedTheme === 'dark' ? logoWhite : logoBlack

  let className = 'flex items-center text-3xl font-bold'
  className += !hrefBoolean ? ' justify-center' : ' justify-start'

  return (
    <div className={className}>
      {hrefBoolean ? (
        <Link href={href} className='flex items-center hover:text-blue-500'>
          <Image src={currentLogo} alt="Fortress Logo" height={200} />
        </Link>
      ) : caller === 'inline' ? (
        <div className='pointer-events-none flex items-center justify-center mx-6'>
          <Image src={currentLogo} alt="Fortress Logo" height={200} />
        </div>
      ) : (
        <div
          className={`inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden ${
            caller !== 'public homepage' ? 'fixed z-[-1] opacity-10' : ''
          }`}
        >
          <Image src={currentLogo} alt="Fortress Logo" height={128} style={{ objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}

export default Logo