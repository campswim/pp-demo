import Container from '../global/container'
import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'
// import HorizontalLine from '../global/horizontal-line'

const Navbar = ({ isDrawer }: { isDrawer: boolean }) => {
  return (
    <nav>
      <Container>
        <Logo />
      {/* </Container> */}
        {/* <HorizontalLine /> */}
      {/* <Container className='flex flex-col min-h-40 pb-6'> */}
        <NavLinks isDrawer={isDrawer}/>
      </Container>
    </nav>
  )
}

export default Navbar