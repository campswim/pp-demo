'use client'
/*
  Demo Landing Page
*/

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function DemoLandingPage() {
  const [showHint, setShowHint] = useState(false)

  return (
    <div className='mt-35 min-h-screen flex flex-col justify-center md:mt-0'>
      <div className='flex flex-col items-center justify-between md:w-[80%] mx-auto'>
        <h2 className='text-white text-5xl md:text-7xl text-center font-heading my-8'>
          Modern banking, tailored to you.
        </h2>
        <h6 className='text-white text-2xl md:text-3xl text-center leading-relaxed md:w-[70%] mx-auto my-10'>
          Experience the future of banking with our innovative financial solutions and exceptional personal service.
        </h6>
        <div className="relative my-10 flex flex-col items-center">
          {showHint && (
            <div className="pointer-events-none absolute -top-12 bg-black/70 text-white text-lg px-4 py-2 rounded-lg shadow-lg">
              Click Log In and enter your Fortress credentials.
            </div>
          )}
          <Button
            size='lg'
            onClick={() => setShowHint((v) => !v)}
            className='text-black bg-white text-2xl px-12 py-7 h-auto border border-white/70 hover:bg-[#173054] hover:text-white transition-colors duration-300 ease-in-out'
          >
            Open an Account
          </Button>
        </div>
      </div>
    </div>
  )
}