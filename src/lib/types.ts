import { JWTPayload } from '@/lib/schemata'
import { Prisma } from '@/generated/prisma'

// The auth and refresh cookies' result after validation.
export type ValidationResult = { 
  valid: boolean, 
  payload?: JWTPayload, 
  reason?: string 
}

// The call status type.
export type CallStatus = 
  | 'success' 
  | 'ringing' 
  | 'in-progress' 
  | 'completed' 
  | 'authenticated' 
  | 'busy' 
  | 'error' 
  | 'failed'
  | ''

// Define the type for the user actions' return object.
export interface UserActionsProps {
  success?: boolean
  error?: string | null
}

export type UserWithVoiceCalls = Prisma.UserGetPayload<{ include: { voiceCalls: true }}>

export interface NavItem {
  id: number
  type: 'public' | 'user' | 'admin' | 'demo'
  auth?: boolean
  name: string
  href: string
  subItems?: NavItem[]
}