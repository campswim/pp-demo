'use client'

import { useEffect, useState } from 'react'
import { getUserById } from '@/utils/userActions'
import { User } from '@/generated/prisma'
import { useLoggedIn } from '@/context/loggedIn'


export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const { userId } = useLoggedIn()

  useEffect(() => {
    (async () => {
      const userData = await getUserById(userId);
      setUser(userData);
    })();
  })
  
  return (
    <div>
      <p>ID: {user?.id || 'N/A'}</p>
      <p>Email: {user?.email || 'N/A'}</p>
      <p>Role: {user?.role || 'N/A'}</p>
      <p>Logged In: {user?.loggedIn ? 'Yes' : 'No'}</p>
      <p>Created: {user?.createdAt?.toLocaleString() || 'N/A'}</p>
      <p>Updated: {user?.updatedAt?.toLocaleString() || 'N/A'}</p>
    </div>
  )
}