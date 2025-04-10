import { deactivateUser } from '@/utils/userActions'

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
        {users.map((user: User, idx: number) => (
          <div key={user.id} className='flex justify-between items-end py-2 md:p-4 border-b border-gray-30'>
            <p className='whitespace-nowrap'>{idx + 1}</p>
            <div className='flex justify-between items-end w-[95%] relative'>
              <p className='mx-2 overflow-auto whitespace-nowrap custom-scrollbar'>
                {user.email}
              </p>
              <p className='md:hidden cursor-pointer'>X</p>
              <p className='hidden md:block md:border border-white rounded md:p-2 cursor-pointer hover:bg-blue-500 hover:border-black transition-colors duration-300'>
                Delete
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  )
}

export default UsersList