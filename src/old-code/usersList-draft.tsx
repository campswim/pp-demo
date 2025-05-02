import DeleteUserButton from '@/components/user/deleteUserButton'

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
      <div className='flex flex-col w-full lg:w-[75%] md:p-8 md:border md:border-gray-30 rounded'>
        {/* Table Header */}
        <div className='flex justify-between items-center py-2 md:p-4 bg-blue-500 border-b border-gray-30'>
          <p className='font-semibold w-1/12'></p>
          <p className='font-semibold w-[35%]'>Email</p>
          <p className='font-semibold w-[25%]'>Created At</p>
          <p className='font-semibold w-[25%]'>Updated At</p>
          <p className='font-semibold w-[15%]'>Actions</p>
        </div>
        {users.map((user: User, idx: number) => (
          <div key={user.id} className='flex justify-between items-end py-2 md:p-4 md:pr-0 border-b border-gray-30'>
            <p className='whitespace-nowrap'>{idx + 1}</p>
            <div className='flex justify-between items-end w-[95%] relative'>
              <p className='mx-2 overflow-auto whitespace-nowrap custom-scrollbar'>
                {user.email}
              </p>
              <p>{user.createdAt.toLocaleString()}</p>
              <p>{user.updatedAt.toLocaleString()}</p>
              <DeleteUserButton userId={user.id} />
            </div>
          </div>
        ))}
      </div>
    )
  )
}

export default UsersList