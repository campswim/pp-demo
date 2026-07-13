'use client'

import { useState, useEffect, useRef } from 'react'
import GridLoaderClient from '@/components/ui/grid-loader'
import { useLoggedIn } from '@/context/loggedIn'
import { useInitiateCall } from '@/hooks/use-initiate-call'
import { useCallStatusPolling } from '@/hooks/use-call-status-polling'
import { useCallRouting } from '@/hooks/use-call-routing'
import { statusMap } from '@/data/status-map'
import type { CallStatus } from '@/lib/types'
import VeritasHeader from '@/components/demo/veritas-header'

export default function HealthCareStart() {
  const [callStatus, setCallStatus] = useState<CallStatus>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const showMessageOne = useRef(true)
  const showMessageTwo = useRef(true)
  const { userId } = useLoggedIn()

  // Trigger the call when the component mounts and the userId is available.
  useInitiateCall(userId, 'demo', setCallStatus, setErrorMessage)

  // Poll for call status updates.
  useCallStatusPolling(callStatus, setCallStatus, setErrorMessage)

  // Stop polling if the call is completed or an error occurs.
  useCallRouting(callStatus, 'health-care')

  useEffect(() => {
    if (callStatus === 'success') showMessageOne.current = false
    if (callStatus === 'ringing') showMessageTwo.current = false
  }, [callStatus])

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex flex-col bg-repeat bg-center"
      style={{ backgroundImage: 'url(/backgrounds/veritas-login-background.png)' }}
    >
      <VeritasHeader />

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div
          className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-center px-10 py-9"
          style={{
            backgroundColor: '#f2ebda',
            boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          }}
        >
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: '#1e2340', fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Verifying Your Identity
          </h1>
          {showMessageOne.current && (
            <p className="text-sm mb-3" style={{ color: '#4a4a5a' }}>
              Stand by for an incoming call to your phone on record.
            </p>
          )}
          {showMessageTwo.current && (
            <p className="text-sm mb-3" style={{ color: '#4a4a5a' }}>
              Please have your safe word and PIN at the ready.
            </p>
          )}
          <GridLoaderClient color="#b8943a" />
          {callStatus !== 'error' && <p className="text-sm mt-3" style={{ color: '#7a7a8a' }}>{statusMap[callStatus]}</p>}
          {callStatus === 'error' && <p className="text-sm mt-3 text-red-600">Error: {errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}
