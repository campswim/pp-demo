import { getUserById } from '@/utils/userActions'
import { User } from '@/generated/prisma'
import { validateAuthCookie } from '@/utils/auth'


export default async function Profile() {
  const decoded = await validateAuthCookie()
  const user: User | null = decoded?.payload?.userId 
    ? await getUserById(decoded.payload.userId) 
    : null

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