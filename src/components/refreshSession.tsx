'use client'

import { useEffect } from 'react'
import { refreshSession } from '@/utils/userActions'
import { JWTPayload } from '@/utils/types'

type Props = {
  payload: JWTPayload | null
}

export default function RefreshSession({ payload }: Props) {
  useEffect(() => {
    if (payload) refreshSession(payload) // Server Action
  }, [payload])

  return null
}