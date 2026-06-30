'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Phase = 'idle' | 'splitting' | 'split'

const DemoButton = () => {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (phase !== 'splitting') return
    const t = setTimeout(() => setPhase('split'), 30)
    return () => clearTimeout(t)
  }, [phase])

  const circleBase = 'bg-[#081025] dark:bg-orange-400 text-white rounded-full shadow-xl w-44 h-44 flex items-center justify-center filter dark:brightness-70 transition-transform duration-500 hover:scale-105 drop-shadow-lg cursor-pointer'

  if (phase === 'idle') {
    return (
      <div className='flex items-center justify-center w-full my-10'>
        <button
          type='button'
          onClick={() => setPhase('splitting')}
          className='bg-[#081025] dark:bg-orange-400 text-white text-2xl lg:text-5xl rounded-full shadow-xl w-60 h-60 flex items-center justify-center filter dark:brightness-70 animate-fade-in transition-transform duration-500 hover:scale-105 drop-shadow-lg z-10'
        >
          <span className='dark:text-white text-7xl transition-transform duration-800 hover:scale-120'>Demo</span>
        </button>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center w-full my-10'>
      <div className='relative flex items-center justify-center w-[30rem] h-44'>

        {/* Banking — slides left */}
        <div
          className='absolute w-44 h-44'
          style={{
            transition: 'transform 650ms cubic-bezier(0.34, 1.45, 0.64, 1), opacity 300ms ease',
            transform: phase === 'split' ? 'translateX(-7rem)' : 'translateX(0)',
            opacity: phase === 'split' ? 1 : 0,
          }}
        >
          <button
            type='button'
            onClick={() => router.push('/demo/landing-page')}
            className={circleBase}
          >
            <span className='dark:text-white text-xl font-medium tracking-wide transition-transform duration-800 hover:scale-120'>Banking</span>
          </button>
        </div>

        {/* Health Care — slides right */}
        <div
          className='absolute w-44 h-44'
          style={{
            transition: 'transform 650ms cubic-bezier(0.34, 1.45, 0.64, 1), opacity 300ms ease',
            transform: phase === 'split' ? 'translateX(7rem)' : 'translateX(0)',
            opacity: phase === 'split' ? 1 : 0,
          }}
        >
          <button
            type='button'
            onClick={() => router.push('/demo/veritas')}
            className={circleBase}
          >
            <span className='dark:text-white text-xl font-medium tracking-wide transition-transform duration-800 hover:scale-120'>Health Care</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default DemoButton
