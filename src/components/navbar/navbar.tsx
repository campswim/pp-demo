import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
import UtilLinks from '@/components/navbar/util-links'

const Navbar = ({ isDrawer }: { isDrawer: boolean }) => {
  return (
    <nav className='relative flex flex-col items-start md:grid md:grid-cols-3 md:items-center min-h-20'>
      <Logo />
      <NavLinks isDrawer={isDrawer} />
      <UtilLinks />
    </nav>
  )
}

export default Navbar