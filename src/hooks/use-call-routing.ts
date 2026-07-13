import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { DemoBrand } from '@/utils/demoActions'

export function useCallRouting(callStatus: string, brand: DemoBrand = 'banking') {
  const router = useRouter()
  const successPath = brand === 'health-care' ? '/demo/health-care/account' : '/demo/account'
  const failurePath = brand === 'health-care' ? '/demo/health-care' : '/demo/login'

  useEffect(() => {
    if (callStatus === 'authenticated') {
      const interval = setInterval(() => {
        router.push(successPath)
      }, 4000)
      return () => clearInterval(interval)
    }

    if (['busy', 'error', 'completed', 'failed'].includes(callStatus)) {
      console.log('DEBUG: Call routing detected error status, redirecting in 4000ms')
      const interval = setInterval(() => {
        console.log(`DEBUG: Redirecting to ${failurePath}`)
        router.push(failurePath)
      }, 4000)
      return () => clearInterval(interval)
    }

    return undefined
  }, [callStatus, router, successPath, failurePath])
}