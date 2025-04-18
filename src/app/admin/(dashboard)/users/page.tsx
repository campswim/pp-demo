/**
 * @file Users admin page.
 * @description Restricted to authenticated users with the 'admin' role.
 * Redirects unauthenticated users to /login.
 * Redirects unauthorized users to /unauthorized.
 * Lists all users.
 * Add-user feature.
 * @module /src/app/admin/users/page.tsx
 */

import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'
import { redirect } from 'next/navigation'
import { validateAuthCookie  } from '@/utils/auth'
import { getUsers } from '@/utils/userActions'

export default async function Users() {
  const decoded = await validateAuthCookie()

  // Redirect to the log-in page, if there is no auth cookie.
  if (!decoded) redirect('/login')

  // Redirect to the unauthorized page, when a user's role is not admin.
  const role = decoded?.payload?.role ?? 'guest'
  if (role !== 'admin') redirect(`/unauthorized?role=${role}`)

  const users = decoded ? await getUsers(role) : null

  return (
    <div className='flex flex-col items-center justify-between xl:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users || []} />
      <NewUserForm />
    </div>
  )
}