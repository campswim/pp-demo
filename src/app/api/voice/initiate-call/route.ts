import { NextResponse } from 'next/server'
import { initiateCall } from '@/utils/voice'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { caller } = body

    if (!caller || (caller !== 'register' && caller !== 'demo')) {
      return NextResponse.json({ success: false, error: 'Invalid caller type.' }, { status: 400 })
    }
    // Initiate the call using the provided caller type.
    const call = await initiateCall(caller)

    return NextResponse.json({ success: true, sid: call.sid })
  } catch (err) {
    console.error('Failed to initiate call:', err)
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Call failed.' }, { status: 500 })
  }
}