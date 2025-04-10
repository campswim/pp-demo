import { getUsers, deactivateUser } from '@/utils/actions'
import NewUserForm from '@/components/createUserForm'
import UsersList from '@/components/usersList'

export default async function Users() {
  const users = await getUsers()

  return (
    <div className='flex flex-col md:flex-row justify-between w-[90%] md:w-3/4'>
      <UsersList users={users} />
      <NewUserForm />
    </div>
  )
}