'use client'

import Link from 'next/link'
import { MdFiberPin } from "react-icons/md"
import PhoneWithText from '@/components/ui/phone-with-text' 
import { TbAmpersand } from "react-icons/tb"
import { useLoggedIn } from '@/context/loggedIn'

const Logo: React.FC<{ hrefBoolean?: boolean, logoSize?: number }> = ({ hrefBoolean = false, logoSize = 100 }) => {
  const { role } = useLoggedIn()
  const href = role !== 'guest' ? '/user/home' : '/'

  let h1Class = 'flex items-center text-3xl font-bold'
  h1Class += !hrefBoolean ? ' justify-center' : ' justify-start'

  return (
    <h1 className={h1Class}>
      {hrefBoolean ? (
        <Link href={href} className='flex items-center hover:text-blue-500'>
          <PhoneWithText size={logoSize} />
          <TbAmpersand />
          <MdFiberPin size={logoSize} />
        </Link>
      ) : (
        <>
          <PhoneWithText size={logoSize} />
          <TbAmpersand size={logoSize / 3}/>
          <MdFiberPin size={logoSize} />
        </>
      )}
    </h1>
  )
}

export default Logo