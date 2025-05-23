'use client'

import { useLoggedIn } from '@/context/loggedIn'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/navbar/logo'

const WelcomeMessage = () => {
  const { username } = useLoggedIn()  
  const usernameFormatted = username ? username[0].toUpperCase() + username.slice(1) : ''  
  const searchParams = useSearchParams()
  const isRegistration = searchParams.get('register') === 'true'
  const isLogin = searchParams.get('login') === 'true'
  const welcomeMessage = usernameFormatted && isRegistration ? 'Welcome' : usernameFormatted && isLogin ? 'Welcome Back' : ''

  return (isLogin || isRegistration) && (
    <div className='relative w-full h-screen'>
      <div className='absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0'>
        <Logo logoSize={800}/>
      </div>
      <div className='mt-[10%]'>
        <h1 className='relative text-9xl z-10'>{welcomeMessage}</h1>
        {usernameFormatted && (
          <p className='text-7xl text-center'>{`\u2013 ${usernameFormatted} \u2013`}</p>
        )}
      </div>
    </div>
  )
}

export default WelcomeMessage