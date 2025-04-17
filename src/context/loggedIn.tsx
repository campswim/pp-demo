'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { JWTPayload as LoggedInUser } from '@/utils/types'

type LoggedInContextType = {
  role: string
  setRole: (role: string) => void
}

type LoggedInProviderProps = {
  children: React.ReactNode
  user: LoggedInUser | null
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, user }: LoggedInProviderProps) {
  const [id, setID] = useState<string>(user?.id)
  const [role, setRole] = useState<string>(user?.role ?? 'guest')
  const initialRole = user?.role ?? 'guest'

  useEffect(() => {
    setID(user?.id !== id ? user?.id : id)
    setRole(role !== initialRole ? initialRole : role)
  }, [user, initialRole, role, id])

  return (
    <LoggedInContext.Provider value={{ role, setRole }}>
      {children}
    </LoggedInContext.Provider>
  )
}

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext)

  if (context === undefined) throw new Error('useLoggedIn must be used within a LoggedInProvider')
  else return context
}
