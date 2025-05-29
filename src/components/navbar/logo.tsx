'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import PhoneWithText from '@/components/ui/phone-with-text' 
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo: React.FC<{ hrefBoolean?: boolean  }> = ({ hrefBoolean = false }) => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'

  let h1Class = 'flex items-center text-3xl font-bold'
  h1Class += !hrefBoolean ? ' justify-center' : ' justify-start'

  return (
    <h1 className={h1Class}>
      {hrefBoolean ? (
        <Link href={href} className='flex items-center hover:text-blue-500'>
          <PhoneWithText className='w-20 h-20' />
          <TbAmpersand className='w-8 h-8' />
          <MdFiberPin className='w-22 h-25' />
        </Link>
      ) : (
        <div className='absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden'>
          <PhoneWithText className='w-full h-auto' />
          <TbAmpersand className='w-[33%] h-auto' />
          <MdFiberPin className='w-full h-auto' />      
        </div>
      )}
    </h1>
  )
}

export default Logo