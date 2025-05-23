import { twiml } from 'twilio'
import { NextRequest } from 'next/server'
import db from '@/utils/db'
import { getPin } from '@/utils/voice'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const retryCount = Number(url.searchParams.get('retry') || '0')
  const formData = await req.formData()
  const callSid = formData.get('CallSid')?.toString() ?? null
  const enteredPin = formData.get('Digits')?.toString() ?? null
  const pin = await getPin(callSid) ?? null
  const isPinValid = pin && enteredPin ? await bcrypt.compare(enteredPin, pin) : false

  const response = new twiml.VoiceResponse()

  // End the call if it is missing an SID.
  if (!callSid) {
    response.say('Call ID is missing. Cannot authenticate the call.')
    response.hangup()
    
    return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
  }

  // Check if the PIN is correct.
  if (isPinValid) {
    response.say('Your PIN is correct and you will be logged into your account shortly. Goodbye.')

    // Update the call status to authenticated.
    await db.voiceCall.update({
      where: { callSid },
      data: { status: 'authenticated' }
    })
  } else { // If the PIN is incorrect, allow the user to retry.
    if (retryCount < 1) {
      response.say("I'm sorry, you've entered your PIN incorrectly. Let's try one more time.")
      response.gather({
        input: ['dtmf'],
        timeout: 2,
        action: `${process.env.BASE_URL}/api/voice/validate-pin?retry=1`,
        method: 'POST'
      }).say('Please enter your PIN again.')
    } else {
      response.say("I'm sorry, you've entered your PIN incorrectly again. Please try logging in again. Goodbye.")
      response.hangup()

      // Update the call status to failed after two incorrect attempts.
      await db.voiceCall.update({
        where: { callSid },
        data: { status: 'failed' }
      })
    }
  }

  return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
}