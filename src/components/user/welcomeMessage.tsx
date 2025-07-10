'use client'

import { useLoggedIn } from '@/context/loggedIn'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const WelcomeMessage = ({ onComplete }: { onComplete: () => void }) => {
  const [showWelcome, setShowWelcome] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const { username } = useLoggedIn()  
  const usernameFormatted = username ? username[0].toUpperCase() + username.slice(1) : ''  
  const searchParams = useSearchParams()
  const isRegistration = searchParams.get('register') === 'true'
  const isLogin = searchParams.get('login') === 'true'
  const welcomeMessage = usernameFormatted && isRegistration ? 'Welcome' : usernameFormatted && isLogin ? 'Welcome Back' : ''

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500)
    const hideTimer = setTimeout(() => setShowWelcome(false), 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (!showWelcome) {
      onComplete()
    }
  }, [showWelcome, onComplete])

  return (isLogin || isRegistration) && (
    <div className='flex items-center justify-center w-full min-h-[50vh]'>
      <div>
        {showWelcome && (
          <div
            className={`flex flex-col items-center justify-center transition-opacity duration-1000 ${
              fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <h1 className='text-center text-2xl lg:text-9xl z-10'>{welcomeMessage}</h1>
            {usernameFormatted && (
              <p className='text-3xl lg:text-7xl text-center'>{`\u2013 ${usernameFormatted} \u2013`}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WelcomeMessage
