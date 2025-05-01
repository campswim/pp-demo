import Container from '../global/container'
import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
import HorizontalLine from '../global/horizontal-line'

const Navbar = () => {
  return (
    <nav className='flex flex-col justify-end min-h-40 pb-6'>
      <Container>
        <Logo />
        <HorizontalLine />
        <NavLinks />
      </Container>
    </nav>
  )
}

export default Navbar