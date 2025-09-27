import { twiml } from 'twilio'

export async function POST(req: Request) {  
  // Get the current URL.
  const url = new URL(req.url)

  // Get the retry count from the URL.
  const retryCount = Number(url.searchParams.get('retry') || '0')

  // Generate a TwiML response.
  const response = new twiml.VoiceResponse()

  // Hang up when the number of attempts exceeds the limit.
  if (retryCount >= 2) {
    response.say('You have exceeded the number of attempts allowed. Please try logging in again.')
    response.hangup()
    return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
  }

  // Create the voice prompt to gather user input.
  const gather = response.gather({
    input: ['speech'],
    action: `${process.env.BASE_URL}/api/voice/validate-safeword?retry=${retryCount}`,
    method: 'POST',
    speechTimeout: '2', // seconds of silence
    speechModel: 'phone_call',
    // enhanced: true, // requires Twilio's enhanced speech recognition
  })
  gather.pause({ length: 1 })
  gather.say('Please speak your safe word to continue.')

  // If no input is received, allow a second try.
  if (retryCount < 1) {
    response.say("I didn't hear anything.")
    response.redirect(`${process.env.BASE_URL}/api/voice/voice-entry?retry=1`)
  } else {
    response.say("I didn't hear anything. Please try logging in again. Goodbye.")
    response.hangup()
  }
  
  return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
}