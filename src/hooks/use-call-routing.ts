import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useCallRouting(callStatus: string) {  
  const router = useRouter()

  useEffect(() => {
    if (callStatus === 'authenticated') {
      const interval = setInterval(() => {
        router.push('/demo/account')
      }, 4000)
      return () => clearInterval(interval)
    }

    if (['busy', 'error', 'completed', 'failed'].includes(callStatus)) {
      console.log('DEBUG: Call routing detected error status, redirecting in 4000ms')
      const interval = setInterval(() => {
        console.log('DEBUG: Redirecting to /demo/login')
        router.push('/demo/login')
      }, 4000)
      return () => clearInterval(interval)
    }

    return undefined
  }, [callStatus, router])
}