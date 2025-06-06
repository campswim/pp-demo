import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/db'
import { getUserSessionWithRefresh } from '@/utils/userActions'

export async function GET() {
  const user = await getUserSessionWithRefresh() ?? null  
  const latestCall = user ? await db.voiceCall.findFirst({
    where: { userId: user?.userId },
    orderBy: { createdAt: 'desc' },
  }) : null

  return NextResponse.json({
    success: true,
    status: latestCall?.status || 'unknown',
  })
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const callSid = formData.get('CallSid') as string
  const callStatus = formData.get('CallStatus') as string
  const currentStatus = await db.voiceCall.findUnique({ where: { callSid } })

  // If there's no SID, skip the DB update.
  if (!callSid || !callStatus) {
    return NextResponse.json({ success: false, error: 'Missing CallSid or CallStatus' }, { status: 400 })
  }

  // If the call status isn't 'authenticated' or 'failed', update it in the DB.
  if (currentStatus?.status && !['authenticated', 'failed'].includes(currentStatus.status)) {
    await db.voiceCall.update({
      where: { callSid },
      data: { status: callStatus },
    })
  }

  return NextResponse.json({ success: true })
}