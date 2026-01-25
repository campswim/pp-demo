import type { UserWithVoiceCalls } from '@/lib/types'
import { getPrismaSchemaFields } from '@/utils/meta'
import { formatHeader, formatPhoneDashed } from '@/utils/helpers'
import { decrypt } from '@/utils/encrypt-decrypt'
import { formatDate } from '@/utils/helpers'

const Profile = ({ user }: { user: Partial<UserWithVoiceCalls> | null }) => {
  const headers = getPrismaSchemaFields('User')
  const excludedHeaders = ['id', 'password', 'createdAt', 'updatedAt']
  const excludedCallHeaders = ['id', 'userId']

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
<ul className="space-y-4">
        {headers.map((header, idx) => {
        if (header === 'safeword') {
          const value = user && user[header] ? decrypt(String(user[header as keyof UserWithVoiceCalls])) : 'Not Set'

          return (
            <li key={idx} className="text-left">
              <span className="font-medium">{formatHeader(header)}:</span> {value}
            </li>
          )
        }

        if (header === 'pin') {
          const value = user && user[header] ? decrypt(String(user[header as keyof UserWithVoiceCalls])) : 'Not Set'

          return (
            <li key={idx} className="text-left">
              <span className="font-medium">{formatHeader(header)}:</span> {value}
            </li>
          )
        }

        if (header === 'phone') {
          const value = user ? formatPhoneDashed(decrypt(String(user[header as keyof UserWithVoiceCalls]))) : 'N/A'
          
          return (
            <li key={idx} className="text-left">
              <span className="font-medium">{formatHeader(header)}:</span> {value}
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
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
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
              </div>
            </li>
          )
        }

        if (!excludedHeaders.includes(header)) {
          const value = String(user?.[header as keyof UserWithVoiceCalls] ?? 'N/A')
          return (
            <li key={idx} className="text-left">
              <span className="font-medium">{formatHeader(header)}:</span> {value}
            </li>
          )
        }

        return null
        })}
      </ul>
    </div>
  )
}

export default Profile