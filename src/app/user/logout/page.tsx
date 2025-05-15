'use client'

import { useEffect } from 'react'
import { logout } from '@/utils/userActions'
import { useSearchParams, useRouter } from 'next/navigation'

const Logout = () => {
  const searchParams = useSearchParams()
  const id: string | null = searchParams.get('id')
  const router = useRouter()

  useEffect(() => {
    const logUserOut = async (id: string | null) => {
      if (!id) throw new Error('No ID was provided to the logout utility.')
      await logout(id)
    }

    logUserOut(id)
    router.push('/login')
  }, [id, router])

  return null
}

export default Logout