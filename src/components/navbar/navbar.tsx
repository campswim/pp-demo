import Logo from './logo-fortress'
import NavLinks from '@/components/navbar/navlinks'
import UtilLinks from '@/components/navbar/util-links'

const Navbar = ({ isDrawer }: { isDrawer: boolean }) => {
  return (
    <nav className='relative flex flex-col items-start sm:flex-row sm:items-center sm:justify-between lg:grid lg:grid-cols-3 lg:items-center min-h-15 py-4 xs:py-0'>
      <div className='w-full flex justify-center sm:justify-start sm:max-w-[40%]'>
        <Logo hrefBoolean={true} />
      </div>
      <NavLinks isDrawer={isDrawer} />
      <UtilLinks />
    </nav>
  )
}

export default Navbar