import { Button } from '@/components/ui/button'
import WelcomeMessage from '@/components/user/welcomeMessage'

export default function Home() {
  return (
    <div>
      Home Page
      <WelcomeMessage />
      <Button variant='default' size='lg' className='p-8 m-8 cursor-pointer'>
        Click Me
      </Button>
    </div>
  );
}
