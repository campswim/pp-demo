import Link from 'next/link';
import { NavItem } from '@/data/navItems';
// import { useLoggedIn } from '@/context/loggedIn';

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  // const isLoggedIn = useLoggedIn();

  console.log({items});

  return (
    <nav className='bg-amber-200 flex flex-col items-center justify-end min-h-40 pb-6'>
      <h1 className='text-black text-3xl font-bold'>Phone & Pin</h1>
      <div className="flex items-center justify-content gap-4 border-t-2 border-black">
        {items.map(item => (
          item.type === 'public' && (
            <Link key={item.id} href={item.url} className="text-black text-lg font-semibold">
              {item.name}
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}
export default Navbar;