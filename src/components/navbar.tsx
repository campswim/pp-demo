'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavItem } from '@/data/navItems';
import { useLoggedIn } from '@/context/loggedIn';

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [pathname, setPathname] = useState<string>(usePathname());
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const isActive = (pagename: string) => pathname === pagename ? 'text-blue-500' : '';
  const { loggedIn, role } = useLoggedIn();

  // Check if the item can be rendered based on the user's role.
  const canRender = (item: NavItem) => {
    if (!loggedIn && role === 'guest') return item.type === 'public';
    if (loggedIn && role === 'member') return item.type === 'private';
    if (loggedIn && role === 'admin') return item.type == 'admin';
    return false;
  };

  // Toggle the sub-menu for the given item.
  const toggleSubMenu = (id: number) => {
    setActiveItem(prev => (prev === id ? null : id));
  };

  // Manually set the pathname, so that the active link is updated.
  const handleLinkClick = (url: string, closeSubMenu: boolean = false) => {
    setPathname(url);
    if (closeSubMenu) setActiveItem(null);
  };

  return (
    <nav className='flex flex-col items-center justify-end min-h-40 pb-6'>
      <h1 className='text-white text-3xl font-bold'>Phone & Pin</h1>
      <div className="flex items-center gap-4 border-t-2 border-white">
        {items && items.length > 0 && items.map(item => (
          canRender(item) && (
            <div key={item.id} className='flex flex-col relative'>
              <div
                onClick={() => toggleSubMenu(item.id)}
                className={`cursor-pointer ${isActive(item.url)} text-lg font-semibold`}
              >
                <Link
                  href={item.url}
                  className={`text-lg font-semibold ${isActive(item.url)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.url);
                  }}
                >
                  {item.name}
                </Link>
              </div>

              {item.subItems && item.subItems.length > 0 && activeItem === item.id && (
                <div className='absolute left-5 top-7 w-full flex flex-col gap-1 whitespace-nowrap'>                  
                {item.subItems.map(sub => (
                    canRender(sub) && (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        className={`text-sm text-gray-300 hover:text-blue-500 ${isActive(sub.url)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(sub.url, true);
                        }}
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
  );
}
export default Navbar;