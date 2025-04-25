'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { MyJWTPayload } from 'jose'
import { validateAuthCookie } from '@/utils/auth'
import { logout } from '@/utils/userActions'

export type LoggedInUser = {
  userId: string
  role: string
}

type LoggedInContextType = {
  userId: string | null
  setUserId: (userId: string) => void
  role: string | null
  setRole: (role: string) => void
}

type LoggedInProviderProps = {
  children: React.ReactNode
  user: (MyJWTPayload & Partial<{ userId: string; role: string }>) | null
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, user }: LoggedInProviderProps) {

  console.log('-------------- LoggedInContext Start ------------------')

  const [userId, setUserId] = useState<string | null>(user?.userId || null)
  const [role, setRole] = useState<string | null>(user?.role || 'guest')
  // const initialRole = role ?? 'guest'
  const pathname = usePathname()

  // useEffect(() => {
  //   setUserId(user?.userId !== userId ? user?.userId ?? null : userId)
  //   setRole(role !== initialRole ? initialRole : role)
  // }, [user, initialRole, role, userId])

  useEffect(() => {
    // Get the auth cookie.
    const getAuthCookie = async () => {
      const user: MyJWTPayload | null = await validateAuthCookie() 
      
      if (user) {
        const newId: string | null = user?.userId ?? null
        const newRole: string = user?.role ?? 'guest'
        if (newId !== userId) {
          setUserId(newId)
          setRole(newRole)
        }
      } else {
        const expiredId = document.cookie.split('; ').find(row => row.startsWith('user-id'))?.split('=')[1]
        console.log({ expiredId })

        if (expiredId) (async () => await logout(expiredId))()

        setUserId(null)
        setRole('guest')
      }
    }
    getAuthCookie()
  }, [userId, pathname])

  console.log({userId, role})

  console.log('-------------- LoggedInContext End ------------------')

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
