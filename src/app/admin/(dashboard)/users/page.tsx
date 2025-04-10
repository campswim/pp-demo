import { getUsers } from '@/utils/actions'
import NewUserForm from '@/components/createUser'

interface User {
  id: string
  email: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

export default async function Users() {
  const users = await getUsers()

  return (
    <div>
      <div>
        {/* <h2 className='text-3xl font-bold'>Create a New User</h2> */}
        <NewUserForm />
      </div>
      {users && users.length > 0 && (
        <div>
          <ul>
            {users.map((user: User) => (
              <li key={user.id}>
                {user.id || 'N/A'} | {user.email || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}