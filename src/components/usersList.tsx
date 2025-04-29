import DeleteUserButton from '@/components/deleteUserButton'
import { User } from '@/generated/prisma'

// const UsersList = (users: User[]) => {
const UsersList = ({ users, headers }: { users: User[], headers: string[] }) => {
  return (
    headers && headers.length > 0 && users && users.length > 0 && (
      <div className='flex w-full overflow-x-auto lg:overflow-visible'>
        <div className='grow md:p-8 md:border md:border-gray-30 rounded'>
          <table className='table-auto min-w-full'>
            <thead>
              <tr className='bg-blue-500'>
                <th key='0' className='px-4 py-2 border-b text-left'>Count</th>
                {headers.map((header: string, key: number) => (
                  <th key={key+1} className='px-4 py-2 border-b text-left'>{header}</th>
                ))}
                <th key={headers.length} className='px-4 py-2 border-b text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User, idx: number) => (
                <tr key={user.id} className='border-b p-6'>
                  <td className='px-4 py-2 align-bottom whitespace-nowrap'>{idx + 1}</td>
                  {Object.entries(user).map(([key, value]) => (
                    key !== 'password' && key !== 'id' &&
                    <td key={key} className='px-4 py-2 align-bottom whitespace-nowrap'>
                      {value instanceof Date ? value.toISOString().split('T')[0] : value.toString()}
                    </td>

                  ))}
                  <DeleteUserButton userId={user.id} />
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