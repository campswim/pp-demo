'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NavItem } from '@/data/navItems'
import { useLoggedIn } from '@/context/loggedIn'
import { logout } from '@/utils/userActions'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  items: NavItem[]
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [pathname, setPathname] = useState<string>(usePathname())
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const { userId, role } = useLoggedIn()
  const router = useRouter()

  // Check if the current pathname matches the item URL.
  const isActive = (pagename: string) => pathname === pagename ? 'text-blue-500' : ''

  // Check if the item can be rendered based on the user's role.
  const canRender = (item: NavItem) => {
    if (role === 'guest') return item.type === 'public'
    if (role === 'user') return item.type === 'user'
    if (role === 'admin') return item.type === 'admin' || item.type === 'user'
    return false
  }

  // Handle mouse hover for parent and submenu
  const handleGroupMouseEnter = (id: number) => {
    setActiveItemId(id) // Show submenu when hovering over parent
  }

  const handleGroupMouseLeave = () => {
    setActiveItemId(null) // Hide submenu when mouse leaves both parent and submenu
  }

  // Manually set the pathname and update active item when a link is clicked.
  const handleLinkClick = (url: string) => {
    setPathname(url) // Update pathname on click
  }

  return (
    <nav className='flex flex-col justify-end min-h-40 pb-6'>
      <h1 className='text-white text-3xl font-bold w-[90%] mx-auto'>
        <Link href='/' className='hover:text-blue-500'>
          Phone & Pin
        </Link>
      </h1>
      <span className='border-t-2 border-white'></span>
      <div className="flex items-center gap-4 w-[90%] mx-auto">
        {items && items.length > 0 && items.map(item => (
          canRender(item) && (
            <div
              key={item.id}
              className='flex flex-col relative group'
              onMouseEnter={() => handleGroupMouseEnter(item.id)}
              onMouseLeave={handleGroupMouseLeave}
            >
              <div className={`cursor-pointer ${isActive(item.url)} text-lg font-semibold`}>
                { item.url !== '/user/logout' ? (
                  <Link
                    href={item.url}
                    className={`text-lg font-semibold ${isActive(item.url)}`}
                    onClick={() => handleLinkClick(item.url)}
                  >
                    {item.name}
                  </Link>
                )
                :
                (
                  <Link href='/' onClick={async (e) => {
                    e.preventDefault()
                    await logout(userId)
                    router.push('/login')
                  }}>
                    {item.name}
                  </Link>
                )}
              </div>

              {/* Show submenu only if the parent is hovered (activeItemId) */}
              {item.subItems && item.subItems.length > 0 && activeItemId === item.id && (
                <div className='absolute left-5 top-7 w-[13rem] flex flex-col gap-1 whitespace-nowrap bg-black p-3 rounded shadow-[0_2px_10px_rgba(255,255,255,0.2)]'>
                  {item.subItems.map(sub => (
                    canRender(sub) && (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        className={`text-lg text-white hover:text-blue-500 ${isActive(sub.url)}`}
                        onClick={() => handleLinkClick(sub.url)}
                      >
                        {sub.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </nav>
  )
}

export default Navbar