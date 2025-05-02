'use client'

import { useLoggedIn } from '@/context/loggedIn'
import { useSearchParams } from 'next/navigation'

const WelcomeMessage = () => {
  const { userId } = useLoggedIn() // This could be username, if/when you add it.
  const searchParams = useSearchParams()
  const isLogin = searchParams.get('login') === 'true'

  return isLogin && (
    <div>{userId ? `Welcome back, ${userId}.` : 'Welcome back.'}</div>
  )
}

export default WelcomeMessage