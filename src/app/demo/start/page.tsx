'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { canInitiateCall } from '@/utils/call-limiter'
import GridLoaderClient from '@/components/ui/grid-loader'
import { useLoggedIn } from '@/context/loggedIn'

type CallStatus = 'success' | 'ringing' | 'in-progress' | 'completed' | 'authenticated' | 'busy' | 'error' | ''

export default function DemoStart() {
  const [callStatus, setCallStatus] = useState<CallStatus>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { userId } = useLoggedIn()
  const statusMap = {
    'success': 'Stand by for the incoming call.',
    'ringing': 'The call is ringing.',
    'in-progress': 'The call is in progress.',
    'completed': 'Apologies, the call has ended without verifying your identity. Please try again.',
    'authenticated': 'You have been granted access. Stand by to be redirected to your account.',
    'busy': 'Your phone is busy. Please ensure you are not on another call when you log in.',
    'error': 'An error has occurred.',
    '': ''
  }

  // Trigger the call when the component mounts and the userId is available.
  useEffect(() => {
    const triggerCall = async () => {
      try {
        const res = await fetch('/api/voice/initiate-call', { method: 'POST' })
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Call initiation failed.')

        setCallStatus('success')
      } catch (err) {
        setCallStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Error during call initiation.')
      }
    }

    if (userId && canInitiateCall(userId)) triggerCall()
  }, [userId])

  // Poll for call status updates.
  useEffect(() => {
    if (!callStatus || callStatus === 'authenticated' || callStatus === 'error' || callStatus === 'busy' || callStatus === 'completed') return

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

  // Stop polling if the call is completed or an error occurs.
  useEffect(() => {
    if (callStatus !== 'authenticated') return
    const interval = setInterval(async () => {
      router.push('/demo/account')
    }, 2000)
    return () => clearInterval(interval)
  })

  // If the call is busy, errors, or returns completed, redirect to the login page.
  useEffect(() => {
    if (callStatus !== 'busy' && callStatus !== 'error' && callStatus !== 'completed') return
      const interval = setInterval(() => {
        router.push('/demo/login')
      }, 2000)
      return () => clearInterval(interval)
  })

  return (
    <div className='text-center'>
      <p>Thanks for logging in.</p>
      <p>Stand by for an incoming call to your phone on record.</p>
      <p>Please have your safe word and PIN at the ready.</p>
      <GridLoaderClient />
      {callStatus !== 'error' && <p className='text-green-500'>{statusMap[callStatus]}</p>}
      {callStatus === 'error' && <p className='text-red-500'>Error: {errorMessage}</p>}
    </div>
  )
}