import { NextRequest } from 'next/server'
import { twiml } from 'twilio'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const callSid = formData.get('CallSid')?.toString() ?? null
  const digits = formData.get('Digits')?.toString()
  const response = new twiml.VoiceResponse()

  if (digits === '1') {
    // User confirmed the safe word → go to PIN registration.
    response.say("Your safe word has been saved. Let's now register your four-digit PIN.")
    response.redirect(`${process.env.BASE_URL}/api/voice/record-pin?callSid=${callSid}`)
  } else if (digits === '2') {
    // User wants to re-record → go back to safe word recording.
    response.say("Okay, let's record your safe word again.")
    response.redirect(`${process.env.BASE_URL}/api/voice/register-creds?callSid=${callSid}`)
  } else {
    // Invalid input → repeat the gather by redirecting back to confirm.
    response.say('Invalid input. Please press 1 to confirm your safe word or 2 to record it again.')
    response.redirect(`${process.env.BASE_URL}/api/voice/confirm-safeword?callSid=${callSid}`)
  }

  return new Response(response.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' }
  })
}