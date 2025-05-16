'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import PhoneWithText from '@/components/ui/phone-with-text' 
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo = () => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'

  return (
    <h1 className='flex items-center text-3xl font-bold'>
      <Link href={href} className='flex items-center hover:text-blue-500'>
        <PhoneWithText size={100} />
        <TbAmpersand />
        <MdFiberPin size={120} />
      </Link>
    </h1>
  )
}

export default Logo