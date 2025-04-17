import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'
import { validateAuthCookie  } from '@/utils/auth'
import { getUsers } from '@/utils/userActions'

export default async function Users() {
  const decoded = await validateAuthCookie()
    const users = await getUsers(decoded)

  return (
    <div className='flex flex-col items-center justify-between xl:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users} />
      <NewUserForm />
    </div>
  )
}