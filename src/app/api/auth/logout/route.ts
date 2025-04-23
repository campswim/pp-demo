import { NextResponse } from 'next/server'
import db from '@/utils/db'

const POST = async (request: Request) => {
  const { userId } = await request.json()

  if (!userId) return new Response('User ID is required', { status: 400 })

  try {
    await db.user.update({
      where: { id: userId },
      data: { loggedIn: false }
    })
  } catch (err) {
    console.warn('Failed to update user loggedIn state value in the DB:', err)
  }

  return NextResponse.json({ status: 200 })
}

export default POST