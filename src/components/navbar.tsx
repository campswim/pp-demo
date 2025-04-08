'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavItem } from '@/data/navItems';
// import { useLoggedIn } from '@/context/loggedIn';

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  // const isLoggedIn = useLoggedIn();
  const [pathname, setPathname] = useState<string>(usePathname());
  const isActive = (pagename: string) => pathname === pagename ? 'text-blue-500' : '';

  return (
    <nav className='flex flex-col items-center justify-end min-h-40 pb-6'>
      <h1 className='text-white text-3xl font-bold'>Phone & Pin</h1>
      <div className="flex items-center gap-4 border-t-2 border-white">
        {items.map(item => (
          item.type === 'public' && (
            <Link 
              key={item.id} 
              href={item.url} 
              className= {`${isActive(item.url)} text-lg font-semibold`}
              onClick={() => setPathname(item.url)}
            >
              {item.name}
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}
export default Navbar;