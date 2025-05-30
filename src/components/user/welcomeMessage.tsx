'use client'

import { useLoggedIn } from '@/context/loggedIn'
import { useSearchParams } from 'next/navigation'

const WelcomeMessage = () => {
  const { username } = useLoggedIn()  
  const usernameFormatted = username ? username[0].toUpperCase() + username.slice(1) : ''  
  const searchParams = useSearchParams()
  const isRegistration = searchParams.get('register') === 'true'
  const isLogin = searchParams.get('login') === 'true'
  const welcomeMessage = usernameFormatted && isRegistration ? 'Welcome' : usernameFormatted && isLogin ? 'Welcome Back' : ''

  return (isLogin || isRegistration) && (
    <div className='flex items-center justify-center w-full py-10'>
      <div>
        <h1 className='text-center text-2xl lg:text-9xl z-10'>{welcomeMessage}</h1>
        {usernameFormatted && (
          <p className='text-3xl lg:text-7xl text-center'>{`\u2013 ${usernameFormatted} \u2013`}</p>
        )}
      </div>
    </div>
  )
}

export default WelcomeMessage