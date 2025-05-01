import Container from '../global/Container'
import Logo from './logo'
import NavLinks from '@/components/navbar/navlinks'

const Navbar = () => {
  return (
    <nav className='flex flex-col justify-end min-h-40 pb-6'>
      <Container>
        <Logo />
        <div className='h-px w-full bg-zinc-300 dark:bg-zinc-700' />
        <NavLinks />
      </Container>
    </nav>
  )
}

export default Navbar