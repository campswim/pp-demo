import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/db'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const callSid = formData.get('CallSid') as string
  const callStatus = formData.get('CallStatus') as string

  console.log(`Twilio call update: ${callSid} → ${callStatus}`)

  if (!callSid || !callStatus) {
    return NextResponse.json({ success: false, error: 'Missing CallSid or CallStatus' }, { status: 400 })
  }

  await db.voiceCall.update({
    where: { callSid },
    data: { status: callStatus },
  })

  return NextResponse.json({ success: true })
}