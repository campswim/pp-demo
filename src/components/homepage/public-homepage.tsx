import Container from '@/components/global/container'
import HomeMobileContent from '@/components/homepage/home-mobile-content'
import HomeDesktopContent from '@/components/homepage/home-desktop-content'

const PublicHomePage: React.FC = () => {
  return (
    <>
      <div className='lg:hidden'>
        <HomeMobileContent />
      </div>
      <Container className='hidden lg:block'>
        <HomeDesktopContent />
      </Container>
    </>
  )
};

export default PublicHomePage;
