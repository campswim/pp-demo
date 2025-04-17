import { JwtPayload } from 'jsonwebtoken'

export interface JWTPayload extends JwtPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export type Cookie = {
  value: string;
  expires?: Date
}