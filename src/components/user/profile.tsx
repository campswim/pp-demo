import type { UserWithVoiceCalls } from '@/lib/types'
import { getPrismaSchemaFields } from '@/utils/meta'
import { formatHeader, formatPhoneDashed, formatDate } from '@/utils/helpers'
import { decrypt } from '@/utils/encrypt-decrypt'

const statusColors: Record<string, string> = {
  authenticated: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  ringing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  queued: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  busy: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

const profileFieldOrder = ['username', 'role', 'phone', 'loggedIn', 'safeword', 'pin']
const excludedCallHeaders = ['id', 'userId']

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

  const voiceCalls = (user?.voiceCalls ?? [] as UserWithVoiceCalls['voiceCalls'])
    .slice()
    .sort((a: UserWithVoiceCalls['voiceCalls'][0], b: UserWithVoiceCalls['voiceCalls'][0]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const callHeaders = voiceCalls.length > 0
    ? Object.keys(voiceCalls[0]).filter((h) => !excludedCallHeaders.includes(h))
    : ['callSid', 'status', 'createdAt']

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
        <div className="w-full lg:w-3/5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Voice Calls
            </h2>
            <div className="flex items-center gap-3">
              {voiceCalls.length > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {voiceCalls.length} {voiceCalls.length === 1 ? 'record' : 'records'}
                </span>
              )}
              {voiceCalls.length > 0 && (
                <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
                  Clear All
                </button>
              )}
            </div>
          </div>

          {voiceCalls.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              No voice call records yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60">
                    {callHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                      >
                        {formatHeader(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {voiceCalls.map((call: UserWithVoiceCalls['voiceCalls'][0]) => (
                    <tr
                      key={call.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {callHeaders.map((h) => {
                        const raw = String(
                          call[h as keyof typeof call] ?? 'N/A'
                        )
                        const isDate = !isNaN(Date.parse(raw)) && h !== 'callSid' && h !== 'status'
                        const displayValue = isDate
                          ? formatDate(raw, 'America/Los_Angeles')
                          : raw

                        return (
                          <td key={h} className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {h === 'status' ? (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[raw] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {raw}
                              </span>
                            ) : h === 'callSid' ? (
                              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                {raw}
                              </span>
                            ) : (
                              displayValue
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
