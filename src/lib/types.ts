import { JWTPayload } from '@/lib/schemata'

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
  | ''

// Define the type for the user actions' return object.
export interface UserActionsProps {
  success?: boolean
  error?: string | null
}
