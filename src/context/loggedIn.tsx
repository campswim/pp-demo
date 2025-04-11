'use client'

import { createContext, useContext, useState } from 'react'

type Role = 'guest' | 'user' | 'admin'

type LoggedInContextType = {
  loggedIn: boolean
  setLoggedIn: (loggedIn: boolean) => void
  role: 'guest' | 'user' | 'admin'
  setRole: (role: 'guest' | 'user' | 'admin') => void
}

type LoggedInProviderProps = {
  children: React.ReactNode
  initialRole?: Role
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, initialRole = 'guest' }: LoggedInProviderProps) {
  const [role, setRole] = useState<Role>(initialRole)
  const [loggedIn, setLoggedIn] = useState<boolean>(initialRole !== 'guest')

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn, role, setRole }}>
      {children}
    </LoggedInContext.Provider>
  )
}

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext)

  if (context === undefined) throw new Error('useLoggedIn must be used within a LoggedInProvider')
  else return context
}
