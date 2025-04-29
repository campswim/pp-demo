'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { JWTPayload } from '@/lib/schemata'
import { getUserSession } from '@/utils/userActions'
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
  user: (JWTPayload & Partial<{ userId: string; role: string }>) | null
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined)

export function LoggedInProvider({ children, user }: LoggedInProviderProps) {
  const [userId, setUserId] = useState<string | null>(user?.userId || null)
  const [role, setRole] = useState<string | null>(user?.role || 'guest')
  const pathname = usePathname()

  useEffect(() => {
    // Get the auth cookie.
    const getAuthCookie = async () => {
      const user: JWTPayload | null = await getUserSession() 
      
      if (user) {
        const newId: string | null = user?.userId ?? null
        const newRole: string = user?.role ?? 'guest'
        if (newId !== userId) {
          setUserId(newId)
          setRole(newRole)
        }
      } else {
        const expiredId = document.cookie.split('; ').find(row => row.startsWith('user-id'))?.split('=')[1]

        // If there is an expired user ID, call logout to remove it, toggle loggedIn to false in the db, and redirect to login.
        if (expiredId) (async () => await logout(expiredId))()

        // Reset the user's ID and role to guest, when tokens have expired.
        setUserId(null)
        setRole('guest')
      }
    }
    getAuthCookie()
  }, [user, userId, pathname])

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
