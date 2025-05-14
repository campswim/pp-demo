import { getUserById } from '@/utils/userActions'
import { redirect } from 'next/navigation'
import type { UserWithVoiceCalls } from '@/lib/types'
import type { JWTPayload } from '@/lib/schemata'
import { getUserSession } from '@/utils/userActions';
import Profile from '@/components/user/profile'

const UserProfile = async () => {
  const user: JWTPayload | null = await getUserSession()
  if (!user) redirect('/login')
  const userId: string | null = typeof user?.userId === 'string' ? user.userId : null
  const userData: Partial<UserWithVoiceCalls> | null = userId ? await getUserById(userId) : null;
  
  return <Profile user={userData} />
}

export default UserProfile