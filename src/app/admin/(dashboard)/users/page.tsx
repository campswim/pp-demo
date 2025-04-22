/**
 * @file Users admin page.
 * @description Restricted to authenticated users with the 'admin' role.
 * Redirects unauthenticated users to /login.
 * Redirects unauthorized users to /unauthorized.
 * Lists all users.
 * Add-user feature.
 * @module /src/app/admin/users/page.tsx
 */
'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'
import { getUsers } from '@/utils/userActions'
import { useLoggedIn } from '@/context/loggedIn'
import { User } from '@/generated/prisma'

export default function Users() {
  const [users, setUsers] = useState<User[] | null>(null)
  const { role } = useLoggedIn()

  // Redirect to the unauthorized page, when a user's role is not admin.
  if (role !== 'admin') redirect(`/unauthorized?role=${role}`)

  useEffect(() => {
      const fetchUsers = async () => {
        setUsers(await getUsers(role) || null)
      }
      fetchUsers()
    }, [role])

  return (
    <div className='flex flex-col items-center justify-between xl:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users || []} />
      <NewUserForm />
    </div>
  )
}