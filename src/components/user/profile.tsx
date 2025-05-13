import { type User } from '@/generated/prisma'
import { getPrismaSchemaFields } from '@/utils/meta'
import { formatHeader, formatPhoneDashed } from '@/utils/helpers'
import { decrypt } from '@/utils/encrypt-decrypt'

const Profile = ({ user }: {user: User | null}) => {
  const headers = getPrismaSchemaFields('User')
  const excludedHeaders = ['id', 'password', 'createdAt', 'updatedAt']

  return (
    <ul className='flex flex-col gap-2'>
      {headers.map((header, idx) => (
        header === 'phone' ? 
        (
          <li key={idx} className='flex gap-2'>
            {formatHeader(header)}: {user ? formatPhoneDashed(decrypt(String(user[header as keyof User]))) : 'N/A'}
          </li>
        )
        :
        (
          !excludedHeaders.includes(header) && <li key={idx} className='flex gap-2'>{formatHeader(header)}: {String(user?.[header as keyof User] ?? 'N/A')}</li>
        )
      ))}
    </ul>
  )
}

export default Profile