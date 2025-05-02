'use client'

import { useEffect } from 'react'
import { logout } from '@/utils/userActions'
import { useRouter } from 'next/navigation'

export default function Logout({ userId }: { userId: string | null }) {
  const router = useRouter()

  useEffect(() => {
    router.push('/')

    if (userId) logout(userId)
  }, [router, userId])

  return null
}