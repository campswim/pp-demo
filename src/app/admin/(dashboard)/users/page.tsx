import { getUsers } from '@/utils/userActions'
import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'

export default async function Users() {
  const users = await getUsers()

  return (
    <div className='flex flex-col items-center justify-between lg:flex-row lg:items-start lg:justify-center gap-10'>
      <UsersList users={users} />
      <NewUserForm />
    </div>
  )
}