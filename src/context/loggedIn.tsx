'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { type JWTPayload } from 'jose'

export type LoggedInUser = {
  userId: string
  role: string
}

type LoggedInContextType = {
  userId: string
  setUserId: (userId: string) => void
  role: string
  setRole: (role: string) => void
}

type LoggedInProviderProps = {
  children: React.ReactNode
  user: (JWTPayload & Partial<{ userId: string; role: string }>) | null
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, user }: LoggedInProviderProps) {
  const [userId, setUserId] = useState<string>(user?.userId ?? '')
  const [role, setRole] = useState<string>(user?.role ?? 'guest')
  const initialRole = user?.role ?? 'guest'

  useEffect(() => {
    setUserId(user?.userId !== userId ? user?.userId ?? '' : userId)
    setRole(role !== initialRole ? initialRole : role)
  }, [user, initialRole, role, userId])

  return (
    <LoggedInContext.Provider value={{ userId, setUserId, role, setRole }}>
      {children}
    </LoggedInContext.Provider>
  )
}

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext)

  if (context === undefined) throw new Error('useLoggedIn must be used within a LoggedInProvider')
  else return context
}
