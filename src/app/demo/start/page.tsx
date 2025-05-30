'use client'

import { useState, useEffect, useRef } from 'react'
import GridLoaderClient from '@/components/ui/grid-loader'
import { useLoggedIn } from '@/context/loggedIn'
import { useInitiateCall } from '@/hooks/use-initiate-call'
import { useCallStatusPolling } from '@/hooks/use-call-status-polling'
import { useCallRouting } from '@/hooks/use-call-routing'
import { statusMap } from '@/data/status-map'
import type { CallStatus } from '@/lib/types'
import Demo from '@/components/ui/demo-background'

export default function DemoStart() {
  const [callStatus, setCallStatus] = useState<CallStatus>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const showMessageOne = useRef(true)
  const showMessageTwo = useRef(true)
  const { userId } = useLoggedIn()

  // Trigger the call when the component mounts and the userId is available.
  useInitiateCall(userId, setCallStatus, setErrorMessage)

  // Poll for call status updates.
  useCallStatusPolling(callStatus, setCallStatus, setErrorMessage)

  // Stop polling if the call is completed or an error occurs.
  useCallRouting(callStatus)

  useEffect(() => {
    if (callStatus === 'success') showMessageOne.current = false
    if (callStatus === 'ringing') showMessageTwo.current = false
  }, [callStatus])

  return (
    <div className='relative w-full flex items-center'>
      <Demo />
      <div className='text-center'>
        {showMessageOne.current && <p className='text-3xl lg:text-5xl p-4 mb-6'>Stand by for an incoming phone call to your phone on record.</p>}
        {showMessageTwo.current && <p className='text-2xl lg:text-4xl p-4'>Please have your safe word and PIN at the ready.</p>}
        <GridLoaderClient />
        {callStatus !== 'error' && <p className='text-green-500'>{statusMap[callStatus]}</p>}
        {callStatus === 'error' && <p className='text-red-500'>Error: {errorMessage}</p>}
      </div>
    </div>
  )
}