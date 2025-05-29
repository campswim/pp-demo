import WelcomeMessage from '@/components/user/welcomeMessage'
import LogoBackground from '@/components/ui/logo-background'

export default function Home() {
  return (
    <div className='relative w-full flex justify-center items-center'>
      <LogoBackground />      
      <WelcomeMessage />
    </div>
  )
}
