import { twiml } from 'twilio'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const pin = formData.get('Digits')?.toString()

  const response = new twiml.VoiceResponse()

  if (pin === '1234') {
    // TODO: mark user as authenticated (e.g. DB, Redis, or WS event)
    response.say('Authentication successful. Goodbye.')
  } else {
    response.say('Incorrect PIN. Goodbye.')
  }

  response.hangup()

  return new Response(response.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  })
}