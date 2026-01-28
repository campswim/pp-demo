'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import PhoneWithText from '@/components/ui/phone-with-text' 
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo: React.FC<{ hrefBoolean?: boolean, caller?: string }> = ({ hrefBoolean = false, caller = null }) => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'

  let className = 'flex items-center text-3xl font-bold'
  className += !hrefBoolean ? ' justify-center' : ' justify-start'

  return (
    <div className={className}>
      {hrefBoolean ? 
      (
        <Link href={href} className='flex items-center hover:text-blue-500'>
          <PhoneWithText className='w-20 h-20' />
          <TbAmpersand className='w-8 h-8' />
          <MdFiberPin className='w-22 h-25' />
        </Link>
      ) 
      : caller === 'inline' ?
      (
        <div className='pointer-events-none flex items-center justify-center mx-6'>
          <PhoneWithText className='w-10 h-auto sm:w-20 xl:w-40' />
          <TbAmpersand className='w-[15%] h-auto' />
          <MdFiberPin className='w-10 h-auto sm:w-20 xl:w-40' />      
        </div>
      )
      :
      (
        <div className={`inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden ${caller && caller !== 'public homepage' ? 'fixed z-[-1] opacity-10' : ''}`}>
          <PhoneWithText className='w-[80vw] h-auto max-w-none' />
          <TbAmpersand className='w-[33%] h-auto' />
          <MdFiberPin className='w-[80vw] h-auto max-w-none' />      
        </div>
      )}
    </div>
  )
}

export default Logo