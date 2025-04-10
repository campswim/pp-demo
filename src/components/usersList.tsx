import DeleteUserButton from '@/components/deleteUserButton'

interface User {
  id: string
  email: string | null
  password: string | null
  createdAt: Date
  updatedAt: Date
}

interface UserListProps {
  users: User[]
}

const UsersList = ({ users }: UserListProps) => {
  return (
    users && users.length > 0 && (
      <div className='overflow-x-auto w-full lg:w-[75%] md:p-8 md:border md:border-gray-30 rounded'>
        <table className='min-w-full table-auto'>
          <thead>
            <tr className='bg-blue-500'>
              <th className='px-4 py-2 border-b text-left'></th>
              <th className='px-4 py-2 border-b text-left'>Email</th>
              <th className='px-4 py-2 border-b text-left'>Created At</th>
              <th className='px-4 py-2 border-b text-left'>Updated At</th>
              <th className='px-4 py-2 border-b text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User, idx: number) => (
              <tr key={user.id} className='border-b'>
                <td className="px-4 py-2 align-bottom">{idx + 1}</td>
                <td className="px-4 py-2 align-bottom">{user.email}</td>
                <td className="px-4 py-2 align-bottom">{user.createdAt.toLocaleString()}</td>
                <td className="px-4 py-2 align-bottom">{user.updatedAt.toLocaleString()}</td>
                <td className="px-4 py-2 pr-0 align-bottom">
                  <DeleteUserButton userId={user.id} />
                </td>              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  )
}

export default UsersList