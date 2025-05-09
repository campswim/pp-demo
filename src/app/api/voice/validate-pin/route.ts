import { twiml } from 'twilio'
import { NextRequest } from 'next/server'
import db from '@/utils/db'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const pin = formData.get('Digits')?.toString()
  const callSid = formData.get('CallSid')?.toString()
  const response = new twiml.VoiceResponse()

  // End the call if it is missing an SID.
  if (!callSid) {
    response.say('Call ID is missing. Cannot verify authentication.')
    response.hangup()

    await db.voiceCall.update({
      where: { callSid },
      data: { status: 'failed' }
    })
    
    return new Response(response.toString(), {
      headers: { 'Content-Type': 'text/xml' }
    })
  }

  if (pin === '1234') {
    response.say('Authentication successful. Goodbye.')

    await db.voiceCall.update({
      where: { callSid },
      data: { status: 'authenticated' }
    })
  } else {
    // To-do: Add a retry mechanism.
    response.say("I'm sorry, you've entered your PIN incorrectly. Goodbye.")

    await db.voiceCall.update({
      where: { callSid },
      data: { status: 'failed' },
    })
  }

  response.hangup()

  return new Response(response.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  })
}