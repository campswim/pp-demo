'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import PhoneWithText from '@/components/ui/phone-with-text' 
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo: React.FC<{ hrefBoolean?: boolean }> = ({ hrefBoolean = false }) => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'
  let h1Class = 'flex items-center text-3xl font-bold'
  h1Class += !hrefBoolean ? ' justify-center' : ' justify-start'

  return (
    <h1 className={h1Class}>
      {hrefBoolean ? (
        <Link href={href} className='flex items-center hover:text-blue-500'>
          <PhoneWithText size={100} />
          <TbAmpersand />
          <MdFiberPin size={120} />
        </Link>
      ) : (
        <>
          <PhoneWithText size={100} />
          <TbAmpersand />
          <MdFiberPin size={120} />
        </>
      )}
    </h1>
  )
}

export default Logo