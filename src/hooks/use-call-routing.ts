import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useCallRouting(callStatus: string) {  
  const router = useRouter()

  useEffect(() => {
    if (callStatus === 'authenticated') {
      const interval = setInterval(() => {
        router.push('/demo/account')
      }, 2000)
      return () => clearInterval(interval)
    }

    if (['busy', 'error', 'completed', 'failed'].includes(callStatus)) {
      const interval = setInterval(() => {
        router.push('/demo/login')
      }, 2000)
      return () => clearInterval(interval)
    }

    return undefined
  }, [callStatus, router])
}