/**
 * @file Users admin page.
 * @description Restricted to authenticated users with the 'admin' role.
 * Redirects unauthenticated users to /login.
 * Redirects unauthorized users to /unauthorized.
 * Lists all users.
 * Add-user feature.
 * @module /src/app/admin/users/page.tsx
 */

import { redirect } from 'next/navigation'
import { validateAuthCookie } from '@/utils/auth'
import { getUsers } from '@/utils/userActions'
import { type JWTPayload } from 'jose'
import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'

export default async function Users() {
  // Redirect to the unauthorized page, when a user's role is not admin.
  const user: JWTPayload | null = await validateAuthCookie()
  const role: string = typeof user?.role === 'string' ? user.role : ''
  const users = role ? await getUsers(role) : null

  if (role !== 'admin') redirect(role ? `/unauthorized?role=${role}` : '/unauthorized') 

  return (
    <div className='flex flex-col items-center justify-between xl:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users || []} />
      <NewUserForm />
    </div>
  )
}