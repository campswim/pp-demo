import { twiml } from 'twilio'

export async function POST(req: Request) {
  // Get the current URL.
  const url = new URL(req.url)

  // Get the retry count from the URL.
  const retryCount = Number(url.searchParams.get('retry') || '0')

  // Generate a TwiML response.
  const response = new twiml.VoiceResponse()

  // If this is a retry, say so.To-do: map 1 - first; indicate limit.
  if (retryCount > 0) {
    response.say(`This is your ${retryCount} retry to register your safe word and PIN.`)
  }

  // Create the voice prompt to gather the safe word and PIN.
  const gather = response.gather({
    input: ['speech'],
    action: `${process.env.BASE_URL}/api/voice/record-safeword?retry=${retryCount}`,
    method:'POST',
    speechTimeout: '2', // seconds of silence
    speechModel: 'phone_call'
  })
  gather.pause({ length: 1 })
  gather.say('Please clearly speak a safe word to register.')
  
  // If no input is received, allow a second try.
  if (retryCount < 1) {
    response.say("I didn't hear anything.")
    response.redirect(`${process.env.BASE_URL}/api/voice/register-creds?retry=${retryCount + 1}`)
  } else {
    response.say("I didn't hear anything. Please try logging in again. Goodbye.")
    response.hangup()
  }

  // Return the generated TwiML XML to Twilio
  return new Response(response.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' }
  })
}