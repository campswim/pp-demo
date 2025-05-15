'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/data/navItems'
import { useLoggedIn } from '@/context/loggedIn'
import { logout } from '@/utils/userActions'
import { navItems } from '@/data/navItems'
import { DrawerClose } from '@/components/ui/drawer'

const NavLinks= ({ isDrawer }: { isDrawer: boolean }) => {
  // const [pathname, setPathname] = useState<string>(usePathname())
  const pathname = usePathname() // Get the current pathname from Next.js router
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const { userId, role } = useLoggedIn()
  // const router = useRouter()

  // Check if the current pathname matches the item URL.
  const isActive = (pagename: string) => pathname === pagename ? 'text-blue-500' : ''

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
              <div className={`cursor-pointer ${isActive(item.url)} text-lg font-semibold`}>
                { item.url !== '/user/logout' ? 
                ( isDrawer ?
                  (
                    <DrawerClose asChild>
                      <Link
                        href={item.url}
                        className={`text-lg font-semibold ${isActive(item.url)}`}
                      >
                        {item.name}
                      </Link>
                    </DrawerClose>
                  )
                  :
                  (
                    <Link
                      href={item.url}
                      className={`text-lg font-semibold ${isActive(item.url)}`}
                    >
                      {item.name}
                    </Link>
                  )
                )
                :
                (
                  <Link href={item.url} onClick={async (e) => {
                    e.preventDefault()
                    await logout(userId)
                  }}>
                    {item.name}
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
                            href={sub.url}
                            className={`text-lg text-white hover:text-blue-500 ${isActive(sub.url)}`}
                          >
                            {sub.name}
                          </Link>
                        </DrawerClose>
                    )
                    :
                    (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        className={`text-lg text-white hover:text-blue-500 ${isActive(sub.url)}`}
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