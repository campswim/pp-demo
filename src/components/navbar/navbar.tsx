import Container from '../global/container'
import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
// import HorizontalLine from '../global/horizontal-line'

const Navbar = () => {
  return (
    <nav>
      <Container>
        <Logo />
      {/* </Container> */}
        {/* <HorizontalLine /> */}
      {/* <Container className='flex flex-col min-h-40 pb-6'> */}
        <NavLinks />
      </Container>
    </nav>
  )
}

export default Navbar