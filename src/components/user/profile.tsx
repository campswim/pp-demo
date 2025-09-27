import type { UserWithVoiceCalls } from '@/lib/types'
import { getPrismaSchemaFields } from '@/utils/meta'
import { formatHeader, formatPhoneDashed } from '@/utils/helpers'
import { decrypt } from '@/utils/encrypt-decrypt'
import { formatDate } from '@/utils/helpers'

const Profile = ({ user }: { user: Partial<UserWithVoiceCalls> | null }) => {
  const headers = getPrismaSchemaFields('User')
  const excludedHeaders = ['id', 'password', 'createdAt', 'updatedAt']
  const excludedCallHeaders = ['id', 'userId']

  console.log({headers})
  return (
    <div>
      {headers.map((header, idx) => {
        if (header === 'safeword') {
          const value = user && user[header] ? decrypt(String(user[header as keyof UserWithVoiceCalls])) : 'Not Set'

          return (
            <div key={idx}>
              {formatHeader(header)}: {value}
            </div>
          )
        }

        if (header === 'pin') {
          const value = user && user[header] ? decrypt(String(user[header as keyof UserWithVoiceCalls])) : 'Not Set'

          return (
            <div key={idx}>
              {formatHeader(header)}: {value}
            </div>
          )
        }

        if (header === 'phone') {
          const value = user ? formatPhoneDashed(decrypt(String(user[header as keyof UserWithVoiceCalls]))) : 'N/A'
          
          return (
            <li key={idx} className='flex gap-2'>
              {formatHeader(header)}: {value}
            </li>
          )
        }

        if (header === 'voiceCalls') {
          const voiceCalls = user?.[header as keyof UserWithVoiceCalls] as UserWithVoiceCalls['voiceCalls'] | undefined

          if (voiceCalls) voiceCalls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          if (!Array.isArray(voiceCalls) || voiceCalls.length === 0) {
            return (
              <li key={idx} className='flex flex-col gap-2'>
                {formatHeader(header)}: None
              </li>
            )
          }

          const callHeaders = Object.keys(voiceCalls?.[0] ?? {})
          const callHeadersFormatted = callHeaders.filter((header) => !excludedCallHeaders.includes(header)).map(header => formatHeader(header))

          return (
            <li key={idx} className='flex flex-col gap-2'>
              {formatHeader(header)}:
              <table className='table-auto min-w-full'>
                <thead>
                  <tr className='bg-blue-500'>
                    {callHeadersFormatted.map((header, idx) => (
                      <th key={idx} className='px-4 py-2 border-b text-left'>{header}</th>
                    ))}
                  </tr>
                </thead>

                {Array.isArray(voiceCalls) && voiceCalls.length > 0 ? 
                (
                  <tbody>
                    {voiceCalls.map(call => (
                      <tr key={call?.id} className='border-b p-6'>
                        {callHeaders.map(header => {
                          if (excludedCallHeaders.includes(header)) return null
                          const value = String(call[header as keyof UserWithVoiceCalls['voiceCalls'][0]] ?? 'N/A')
                          
                          return (
                            <td 
                              key={`${call.callSid}-{${header}`} 
                              className='px-4 py-2 align-bottom whitespace-nowrap'
                            >
                              {!isNaN(Date.parse(value)) ? 
                              (
                                formatDate(value, 'America/Los_Angeles')
                              )
                              : 
                              (
                                value
                              )} 
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                ) 
                : 
                (
                  'None'
                )}
              </table>
            </li>
          )
        }

        if (!excludedHeaders.includes(header)) {
          const value = String(user?.[header as keyof UserWithVoiceCalls] ?? 'N/A')
          return (
            <li key={idx} className='flex gap-2'>
              {formatHeader(header)}: {value}
            </li>
          )
        }

        return null
      })}
    </div>
  )
}

export default Profile