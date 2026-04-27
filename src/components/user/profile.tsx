import type { UserWithVoiceCalls } from '@/lib/types'
import { getPrismaSchemaFields } from '@/utils/meta'
import { formatHeader, formatPhoneDashed } from '@/utils/helpers'
import { decrypt } from '@/utils/encrypt-decrypt'
import VoiceCallsList from './voice-calls-list'



const profileFieldOrder = ['username', 'role', 'phone', 'loggedIn', 'safeword', 'pin']

function resolveFieldValue(
  header: string,
  user: Partial<UserWithVoiceCalls>
): string {
  const raw = user[header as keyof UserWithVoiceCalls]

  if (header === 'safeword' || header === 'pin') {
    return raw ? decrypt(String(raw)) : 'Not set'
  }
  if (header === 'phone') {
    return raw ? formatPhoneDashed(decrypt(String(raw))) : 'N/A'
  }
  return raw !== undefined && raw !== null ? String(raw) : 'N/A'
}

const Profile = ({ user }: { user: Partial<UserWithVoiceCalls> | null }) => {
  const allHeaders = getPrismaSchemaFields('User')
  const profileHeaders = profileFieldOrder.filter((h) => allHeaders.includes(h))

  
  const username = user?.username ?? 'User'
  const role = user?.role ?? ''
  const initial = username[0]?.toUpperCase() ?? 'U'
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Profile Info Card */}
        <div className="w-full lg:w-2/5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          {/* Card header with avatar */}
          <div className="bg-blue-100 dark:bg-gray-900 px-6 pt-8 pb-12" />
          <div className="px-6 pb-6 -mt-8">
            <div className="flex items-end gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {initial}
              </div>
              <div className="mb-1">
                <p className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                  {username}
                </p>
                {role && (
                  <span className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 capitalize">
                    {role}
                  </span>
                )}
              </div>
            </div>

            <dl className="divide-y divide-gray-100 dark:divide-gray-800">
              {profileHeaders.map((header) => {
                if (header === 'username' || header === 'role') return null
                const value = resolveFieldValue(header, user ?? {})
                return (
                  <div key={header} className="py-3 flex justify-between gap-4">
                    <dt className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {formatHeader(header)}
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100 text-right">
                      {header === 'loggedIn' ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${value === 'true' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {value === 'true' ? 'Active' : 'Inactive'}
                        </span>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>

        {/* Right: Voice Calls Card */}
        <VoiceCallsList user={user} />
      </div>
    </div>
  )
}

export default Profile
