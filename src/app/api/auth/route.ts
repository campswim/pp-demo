import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('auth')?.value

  if (!cookie) return NextResponse.json({ loggedIn: false, role: 'guest' })

  const { loggedIn, role } = JSON.parse(cookie)
  return NextResponse.json({ loggedIn, role })
}