import { twiml } from 'twilio'

export async function POST() {
  const response = new twiml.VoiceResponse()

  response.gather({
    input: ['speech', 'dtmf'],
    action: `${process.env.BASE_URL}/api/voice/validate-safeword`,
    method: 'POST',
    speechTimeout: 'auto',
  }).say('Please say or type your safe word.')

  return new Response(response.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  })
}