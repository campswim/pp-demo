'use client'

import { useLoggedIn } from '@/context/loggedIn'
import { useSearchParams } from 'next/navigation'

const WelcomeMessage = () => {
  const { username } = useLoggedIn()
  const usernameFormatted = username ? username[0].toUpperCase() + username.slice(1) : ''
  const searchParams = useSearchParams()
  const isRegistration = searchParams.get('register') === 'true'
  const isLogin = searchParams.get('login') === 'true'
  const welcomeMessage = usernameFormatted && isRegistration ? `Welcome, ${usernameFormatted}.` : usernameFormatted && isLogin ? `Welcome back, ${usernameFormatted}.` : 'Welcome back.'

  return (isLogin || isRegistration) && (
    <div>{welcomeMessage}</div>
  )
}

export default WelcomeMessage