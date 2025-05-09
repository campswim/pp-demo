import { twiml } from 'twilio'

export async function POST(req: Request) {
  // Get the current URL.
  const url = new URL(req.url)

  // Get the retry count from the URL.
  const retryCount = Number(url.searchParams.get('retry') || '0')

  // Generate a TwiML response.
  const response = new twiml.VoiceResponse()
  
  // Create the voice prompt to gather user input.
  response.gather({
    input: ['speech', 'dtmf'],
    action: `${process.env.BASE_URL}/api/voice/validate-safeword`,
    method: 'POST',
    timeout: 10, // seconds to wait for DTMF input
    speechTimeout: 'auto',
  }).say('Please say or type your safe word.')

  // If no input is received, allow a second try.
  if (retryCount < 1) {
    response.say("I didn't hear anything. Please try again.")
    response.redirect(`${process.env.BASE_URL}/api/voice/voice-entry?retry=1`)
  } else {
    response.say("I still can't hear anything. Please try logging in again. Goodbye!")
    response.hangup()
  }

  return new Response(response.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  })
}