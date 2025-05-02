import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(req: NextRequest) {
  const { phoneNumber } = await req.json()

  try {
    const call = await client.calls.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER!,
      url: `${process.env.BASE_URL}/api/voice/voice-entry`,
      method: 'POST'
    })

    return NextResponse.json({ sid: call.sid })
  } catch (err) {
    console.error('Failed to initiate call:', err)
    return NextResponse.json({ error: 'Call failed' }, { status: 500 })
  }
}