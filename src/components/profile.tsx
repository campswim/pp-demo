'use client'

import { type User } from '@/generated/prisma'

const Profile = ({ user }: {user: User | null}) => {
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

export default Profile