'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface LoggedInUser{
  id?: string
  loggedIn?: boolean
  role?: 'guest' | 'user' | 'admin'
  token?: string
}

type LoggedInContextType = {
  loggedIn: boolean
  setLoggedIn: (loggedIn: boolean) => void
  role: 'guest' | 'user' | 'admin'
  setRole: (role: 'guest' | 'user' | 'admin') => void
  token?: string
  setToken: (token?: string) => void
  id?: string
  setID: (id?: string) => void
}

type LoggedInProviderProps = {
  children: React.ReactNode
  user?: LoggedInUser
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, user }: LoggedInProviderProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(user?.loggedIn ?? false)
  const [role, setRole] = useState<'guest' | 'user' | 'admin'>(user?.role ?? 'guest')
  const [token, setToken] = useState<string | undefined>(user?.token)
  const [id, setID] = useState<string | undefined>(user?.id)
  const initialRole = user?.role ?? 'guest'

  useEffect(() => {
    setID(user?.id !== id ? user?.id : id)
    setRole(role !== initialRole ? initialRole : role)
    setLoggedIn(user?.loggedIn ?? false)
    setToken(user?.token)
  }, [user, initialRole, role, id])

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn, role, setRole, token, setToken, id, setID}}>
      {children}
    </LoggedInContext.Provider>
  )
}

export const useLoggedIn = () => {
  const context = useContext(LoggedInContext)

  if (context === undefined) throw new Error('useLoggedIn must be used within a LoggedInProvider')
  else return context
}
