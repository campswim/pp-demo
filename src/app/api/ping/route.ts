// /app/api/ping/route.ts
import { NextResponse } from 'next/server'
import db from '@/utils/db'

export async function GET() {
  try {
    const result = await db.user.findFirst({ select: { id: true } })

    if (!result) {
      return NextResponse.json({ message: 'pong (no users found)' })
    }

    return NextResponse.json({ message: 'pong' })
  } catch (error) {
    console.error('Ping DB error:', error)

    return NextResponse.json(
      { message: 'error: could not reach database' },
      { status: 500 }
    )
  }
}