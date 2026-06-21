import { useEffect } from 'react'
import { canInitiateCall } from '@/utils/call-limiter'
import type { CallStatus } from '@/lib/types'

export function useInitiateCall(userId: string | null, caller: 'register' | 'demo', setCallStatus: (s: CallStatus) => void, setErrorMessage: (m: string) => void) {
  useEffect(() => {
    const triggerCall = async () => {
      try {
        const res = await fetch('/api/voice/initiate-call', { method: 'POST', body: JSON.stringify({ caller }) })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Call initiation failed.')

        setCallStatus('success')
      } catch (err) {
        console.log('DEBUG: Setting error state in useInitiateCall')
        console.log('DEBUG: Error message:', err instanceof Error ? err.message : 'Error during call initiation.')
        setCallStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Error during call initiation.')
        console.log('DEBUG: Error state set')
      }
    }

    if (userId && canInitiateCall(userId)) triggerCall()
  }, [userId, caller, setCallStatus, setErrorMessage])
}
