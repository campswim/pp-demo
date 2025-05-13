import { twiml } from 'twilio'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const retryCount = Number(url.searchParams.get('retry') || '0')
  const formData = await req.formData()
  const speechResult = formData.get('SpeechResult')?.toString().trim().toLowerCase()
  // const digits = formData.get('Digits')?.toString().trim().toLowerCase()
  // const transcript = (speechResult || digits)?.replace(/[^\w\s]/g, '')
  const transcript = speechResult?.replace(/[^\w\s]/g, '')
  const response = new twiml.VoiceResponse()
  const acceptedWords = ['banana', 'pineapple']

  if (acceptedWords.some(word => transcript?.includes(word))) {
    response.say('Your safe word has been accepted.')
    response.say('Now, using your phone\'s keypad, please enter your four-digit PIN.')
    response.gather({
      input: ['dtmf'],
      numDigits: 4,
      action: `${process.env.BASE_URL}/api/voice/validate-pin`,
      method: 'POST'
    })
  } else { // If the safe word is incorrect, ask for it again.
    if (retryCount < 1) {
      response.say('Your safe word is incorrect.')
      response.redirect(`${process.env.BASE_URL}/api/voice/voice-entry?retry=${retryCount + 1}`)
      return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
    } else {
      response.say('Your safe word is still incorrect. Please try logging in again. Goodbye!')
      response.hangup()
    }
  }

  return new Response(response.toString(), { headers: { 'Content-Type': 'text/xml' }})
}