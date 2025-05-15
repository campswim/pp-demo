import Container from '../global/container'
import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
// import HorizontalLine from '../global/horizontal-line'

const Navbar = ({ isDrawer }: { isDrawer: boolean }) => {
  return (
    <nav>
      <Container className='flex min-h-40 pb-6'>
        <Logo />
        <NavLinks isDrawer={isDrawer}/>
      </Container>
    </nav>
  )
}

export default Navbar