import Container from '@/components/global/container'
import Logo from '@/components/navbar/logo'
// import HomeMobileContent from '@/components/homepage/home-mobile-content'
// import HomeDesktopContent from '@/components/homepage/home-desktop-content'

const PublicHomePage: React.FC = () => {
  return (
    <>
      <div className='lg:hidden'>
        {/* <HomeMobileContent /> */}
        <Logo />
      </div>
      <Container className='hidden lg:block'>
        {/* <HomeDesktopContent /> */}
        <Logo />
      </Container>
    </>
  )
};

export default PublicHomePage;
