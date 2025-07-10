'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import WelcomeMessage from '@/components/user/welcomeMessage'
import DemoButton from '@/components/demo/demo-button'

export default function Home() {
  const searchParams = useSearchParams()
  const shouldDelay = searchParams.size > 0
  const [showButton, setShowButton] = useState(!shouldDelay)

  const handleWelcomeComplete = () => {
    if (shouldDelay) setShowButton(true)
  }

  return (
    <>
      <div className='relative w-full'>
        <div className='flex flex-col items-center justify-center'>
          {shouldDelay && <WelcomeMessage onComplete={handleWelcomeComplete} />}
          {showButton && <DemoButton />}
        </div>
      </div>
    </>
  )
}
