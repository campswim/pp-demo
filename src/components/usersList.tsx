import DeleteUserButton from '@/components/deleteUserButton'
import { User } from '@/generated/prisma'

// const UsersList = (users: User[]) => {
const UsersList = ({ users }: { users: User[] }) => {
  return (
    users && users.length > 0 && (
      <div className='flex w-full overflow-x-auto lg:overflow-visible'>
        <div className='grow md:p-8 md:border md:border-gray-30 rounded'>
          <table className='table-auto min-w-full'>
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
                  <td className="px-4 py-2 align-bottom whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-2 align-bottom whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2 align-bottom whitespace-nowrap">{user.createdAt.toLocaleString()}</td>
                  <td className="px-4 py-2 align-bottom whitespace-nowrap">{user.updatedAt.toLocaleString()}</td>
                  <td className="px-4 py-2 pr-0 align-bottom w-[5rem] whitespace-nowrap">
                    <DeleteUserButton userId={user.id} />
                  </td>              
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  )
}

export default UsersList