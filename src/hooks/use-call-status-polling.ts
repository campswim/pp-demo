import { useEffect } from 'react'
import type { CallStatus } from '@/lib/types'

const terminalStates = ['authenticated', 'error', 'busy', 'completed']

export function useCallStatusPolling(callStatus: string, setCallStatus: (s: CallStatus) => void, setErrorMessage: (m: string) => void) {
  useEffect(() => {
    if (!callStatus || terminalStates.includes(callStatus)) return

    const interval = setInterval(async () => {
      try { 
        const res = await fetch('/api/voice/call-status')
        const data = await res.json()

        if (!data.success) return
        setCallStatus(data.status)
      } catch (err) {
        console.error('Error fetching call status:', err)
        setCallStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Error fetching call status.')
      }
    }, 5000)

    return () => clearInterval(interval)
  })
}