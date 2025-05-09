'use client'

import { useEffect, useState } from 'react'
import GridLoaderClient from '@/components/ui/grid-loader'

export default function DemoStart() {
  const [callStatus, setCallStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const triggerCall = async () => {
      try {
        const res = await fetch('/api/voice/initiate-call', { method: 'POST' })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Unknown error')
        setCallStatus('success')
      } catch (err) {
        setCallStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    triggerCall()
  }, [])

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