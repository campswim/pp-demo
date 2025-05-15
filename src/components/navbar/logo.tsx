'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import { PiPhoneDisconnectBold } from "react-icons/pi"
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo = () => {
  const { role } = useLoggedIn()
  const href = role ? '/user/home' : '/'

  return (
    <h1 className='flex items-center text-3xl font-bold px-4'>
      <Link href={href} className='flex items-center hover:text-blue-500'>
        <PiPhoneDisconnectBold size={100} />
        <TbAmpersand />
        <MdFiberPin size={100} />
      </Link>
    </h1>
  )
}

export default Logo