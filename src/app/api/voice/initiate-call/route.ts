import { NextResponse } from 'next/server'
import { initiateCall } from '@/utils/voice'

export async function POST() {
  try {
    const call = await initiateCall()

    return NextResponse.json({ success: true, sid: call.sid })
  } catch (err) {
    console.error('Failed to initiate call:', err)
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Call failed.' }, { status: 500 })
  }
}