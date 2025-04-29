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
import { getUserSession } from '@/utils/userActions'
import { getPrismaSchemaFields } from '@/utils/meta'
import { getUsers } from '@/utils/userActions'
import { formatHeaders } from '@/utils/helpers'
import type { JWTPayload } from '@/lib/schemata'
import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'

export default async function Users() {
  // Redirect to the unauthorized page, when a user's role is not admin.
  const user: JWTPayload | null = await getUserSession()
  const role: string = typeof user?.role === 'string' ? user.role : ''
  const users = role ? await getUsers(role) : null
  const columnHeaders = getPrismaSchemaFields('User', ['id', 'password'])
  const formattedHeaders: string | string[] | null = columnHeaders ? formatHeaders(columnHeaders) : null

  if (role && role !== 'admin') redirect(`/unauthorized?role=${role}`)
  else if (!role) redirect(`/login`)

  return (
    <div className='flex flex-col items-center justify-between xl:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users || []} headers={formattedHeaders || []} />
      <NewUserForm />
    </div>
  )
}