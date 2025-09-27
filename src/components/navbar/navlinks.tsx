'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/lib/types'
import { useLoggedIn } from '@/context/loggedIn'
import { logout } from '@/utils/userActions'
import { navItems } from '@/data/navItems'
import { DrawerClose } from '@/components/ui/drawer'
import { GridLoader } from 'react-spinners'

const NavLinks= ({ isDrawer }: { isDrawer: boolean }) => {
  const pathname = usePathname() // Get the current pathname from Next.js router
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { userId, role } = useLoggedIn()

  // Check if the current pathname matches the item URL.
  const isActive = (pagename: string) => pathname === pagename ? 'text-blue-500 border-b-2 border-blue-500' : ''

  // Check if the item can be rendered based on the user's role.
  const canRender = (item: NavItem) => {
    if (role === 'guest') return item.type === 'public'
    if (role === 'user') return item.type === 'user'
    if (role === 'admin') return item.type === 'admin' || item.type === 'user'
    return false
  }

  // Handle mouse hover for parent and submenu.
  const handleGroupMouseEnter = (id: number) => {
    setActiveItemId(id) // Show submenu when hovering over parent
  }

  // Handle mouse leave for parent and submenu.
  const handleGroupMouseLeave = () => {
    setActiveItemId(null) // Hide submenu when mouse leaves both parent and submenu
  }

  useEffect(() => {
    if (!userId) {
      setIsLoggingOut(false)
    }
  }, [userId])
  
  return (
    <div className='flex justify-center items-center'>
      <div className="flex items-center gap-8">
        {navItems && navItems.length > 0 && navItems.map(item => (
          canRender(item) && (
            <div
              key={item.id}
              className='flex flex-col relative group'
              onMouseEnter={() => handleGroupMouseEnter(item.id)}
              onMouseLeave={handleGroupMouseLeave}
            >
              <div className={`cursor-pointer text-lg font-semibold`}>
                { item.href !== '/user/logout' ? 
                ( isDrawer ?
                  (
                    <DrawerClose asChild>
                      <Link
                        href={item.href}
                        className={`text-lg font-semibold ${isActive(item.href)}`}
                      >
                        {item.name}
                      </Link>
                    </DrawerClose>
                  )
                  :
                  (
                    <Link
                      href={item.href}
                      className={`text-lg font-semibold ${isActive(item.href)}`}
                    >
                      {item.name}
                    </Link>
                  )
                )
                :
                (
                  <Link href={item.href} onClick={async (e) => {
                    e.preventDefault()
                    setIsLoggingOut(true)
                    await logout(userId)
                    setIsLoggingOut(false)
                  }}>
                    {isLoggingOut ? 
                    (
                      <GridLoader color='#0ea5e9' size={3} />
                    )
                    :
                    (
                      item.name
                    )}
                  </Link>
                )}
              </div>

              {/* Show submenu only if the parent is hovered (activeItemId) */}
              {item.subItems && item.subItems.length > 0 && activeItemId === item.id && (
                <div className='absolute left-5 top-7 w-[13rem] flex flex-col gap-1 whitespace-nowrap bg-black p-3 rounded shadow-[0_2px_10px_rgba(255,255,255,0.2)]'>
                  {item.subItems.map(sub => (
                    canRender(sub) && 
                    (
                      isDrawer ?
                      (
                        <DrawerClose asChild key={sub.id} >
                          <Link
                            href={sub.href}
                            className={`text-lg text-white hover:text-blue-500 ${isActive(sub.href)}`}
                          >
                            {sub.name}
                          </Link>
                        </DrawerClose>
                    )
                    :
                    (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        className={`text-lg text-white hover:text-blue-500 ${isActive(sub.href)}`}
                      >
                        {sub.name}
                      </Link>
                    )
                    )
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default NavLinks