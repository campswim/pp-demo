'use client'

import type { UserWithVoiceCalls } from '@/lib/types'
import { formatHeader, formatDate } from '@/utils/helpers'
import { useRouter } from 'next/navigation'

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

const excludedCallHeaders = ['id', 'userId']

interface VoiceCallsListProps {
  user: Partial<UserWithVoiceCalls> | null
}

const VoiceCallsList = ({ user }: VoiceCallsListProps) => {
  const router = useRouter()
  
  const voiceCalls = (user?.voiceCalls ?? [] as UserWithVoiceCalls['voiceCalls'])
    .slice()
    .sort((a: UserWithVoiceCalls['voiceCalls'][0], b: UserWithVoiceCalls['voiceCalls'][0]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const callHeaders = voiceCalls.length > 0
    ? Object.keys(voiceCalls[0]).filter((h) => !excludedCallHeaders.includes(h))
    : ['callSid', 'status', 'createdAt']

  const handleDeleteAll = async () => {
    if (!user?.id) return
    
    if (!confirm('Are you sure you want to delete all voice call records? This action cannot be undone.')) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('userId', user.id)
      
      await fetch('/api/voice/delete-voice-calls', {
        method: 'POST',
        body: formData,
      })
      
      router.refresh()
    } catch (error) {
      console.error('Failed to delete voice calls:', error)
    }
  }

  return (
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
          {voiceCalls.length > 0 && user?.id && (
            <button 
              onClick={handleDeleteAll}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
            >
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
  )
}

export default VoiceCallsList
