/**
 * Fortress logo component supporting light/dark mode PNGs and all layout logic.
 */

'use client'

import Link from 'next/link'
import { useLoggedIn } from '@/context/loggedIn'
import Image from 'next/image'

// Import PNGs for light and dark mode
import FortressLogoLight from '../../../public/logos/Fortress-white-text.png'
import FortressLogoDark from '../../../public/logos/Fortress-dark-text.png'
import FortressEmblem from '../../../public/logos/Fortress-Emblem.png'

const Logo: React.FC<{ hrefBoolean?: boolean; caller?: string }> = ({
  hrefBoolean = false,
  caller = null,
}) => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'

  let className = 'flex items-center text-3xl font-bold'
  className += !hrefBoolean ? ' justify-center' : ' justify-start'

  // Common logo sizes for all usages
  const logoHeight =
    caller === 'inline'
      ? 200
      : hrefBoolean
      ? 150
      : 100

  // Wrapper for dual PNGs with dark/light support
  const FortressLogoDual = (
    <span className="relative block" aria-label="Fortress Logo">
      {/* Light mode PNG */}
      <Image
        src={FortressLogoDark}
        alt="Fortress Logo"
        style={{ height: logoHeight, width: 'auto' }}
        className="block py-2 dark:hidden object-contain lg:landscape:max-w-none lg:max-w-none"
        priority
      />
      {/* Dark mode PNG */}
      <Image
        src={FortressLogoLight}
        alt="Fortress Logo"
        style={{ height: logoHeight, width: 'auto' }}
        className="hidden py-2 dark:block object-contain lg:landscape:max-w-none lg:max-w-none"
        priority
      />
    </span>
  )

  return (
    <div className={className}>
      {hrefBoolean ? (
        <Link
          href={href}
          className="flex items-center hover:text-blue-500"
        >
          {FortressLogoDual}
        </Link>
      ) : caller === 'inline' ? (
        <div className="pointer-events-none flex items-center justify-center mx-6">
          {FortressLogoDual}
        </div>
      ) : (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden md:top-3/8 ${
            caller && caller !== 'public homepage' ? 'fixed z-[-1]' : ''
          }`}
        >
          <Image src={FortressEmblem} alt="Fortress Emblem" />
        </div>
      )}
    </div>
  )
}

export default Logo