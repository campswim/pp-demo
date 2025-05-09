'use client'

import { useEffect, useState } from 'react'
import { canInitiateCall } from '@/utils/call-limiter'
import GridLoaderClient from '@/components/ui/grid-loader'
import { useLoggedIn } from '@/context/loggedIn'

export default function DemoStart() {
  const [callStatus, setCallStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { userId } = useLoggedIn()

  useEffect(() => {
    const triggerCall = async () => {
      try {
        console.log('📞 useEffect running')

        const res = await fetch('/api/voice/initiate-call', { method: 'POST' })
        const data = await res.json()

        console.log({data})

        if (!data.success) throw new Error(data.error || 'Try block: Error triggering the auth call.')
        setCallStatus('success')
      } catch (err) {
        setCallStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Error block: Error triggering the auth call')
      }
    }

    if (userId && canInitiateCall(userId)) triggerCall()
  }, [userId])

  console.log({callStatus, errorMessage})

  return (
    <div className='text-center'>
      <p>Thanks for logging in.</p>
      <p>Stand by for an incoming call to your phone on record.</p>
      <p>Please have your safe word and PIN at the ready.</p>
      <GridLoaderClient />
      {callStatus === 'success' && <p className='text-green-500'>Call initiated.</p>}
      {callStatus === 'error' && <p className='text-red-500'>Error: {errorMessage}</p>}
    </div>
  )
}