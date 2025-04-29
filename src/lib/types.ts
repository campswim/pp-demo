import { JWTPayload } from '@/lib/schemata'

// The auth and refresh cookies' result after validation.
export type ValidationResult = { 
  valid: boolean, 
  payload?: JWTPayload, 
  reason?: string 
}

// // The cookie object.
// export type Cookie = {
//   value: string;
//   expires?: Date
// }

// Define the type for the user actions' return object.
export interface UserActionsProps {
  success?: boolean
  error?: string | null
}
