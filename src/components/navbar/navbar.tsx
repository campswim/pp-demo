import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
import UtilLinks from '@/components/navbar/util-links'

const Navbar = ({ isDrawer }: { isDrawer: boolean }) => {
  return (
    <nav className='grid grid-cols-3 items-center min-h-20'>
      <Logo />
      <NavLinks isDrawer={isDrawer} />
      <UtilLinks />
    </nav>
  )
}

export default Navbar