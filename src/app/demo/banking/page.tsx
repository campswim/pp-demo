'use client'
/*
  Demo Landing Page
*/

import LoginForm from '@/components/user/login-form'

export default function BankingDemoLandingPage() {
  return (
    <div className='mt-36 px-2 md:px-0 landscape:mt-30 flex flex-col flex-1 md:mt-0'>
      <div className='flex flex-col items-center justify-between md:w-[80%] mx-auto'>
        <h2 className='text-white text-5xl md:text-7xl text-center font-heading my-8'>
          Modern banking, tailored to you.
        </h2>
        <h6 className='text-white text-2xl md:text-3xl text-center leading-relaxed md:w-[70%] mx-auto my-10'>
          Experience the future of banking with our innovative financial solutions and exceptional personal service.
        </h6>
        <div className='my-10'>
          <LoginForm caller='demo' />
        </div>
      </div>
    </div>
  )
}