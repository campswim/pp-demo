import { twiml } from 'twilio'

export async function POST(req: Request) {
  const formData = await req.formData()
  const speechResult = formData.get('SpeechResult')?.toString().trim().toLowerCase()
  const digits = formData.get('Digits')?.toString().trim().toLowerCase()
  const transcript = (speechResult || digits)?.replace(/[^\w\s]/g, '')
  const response = new twiml.VoiceResponse()
  const acceptedWords = ['banana', 'pineapple']

if (acceptedWords.some(word => transcript?.includes(word))) {
    response.say('Safe word accepted. Now enter your 4 digit PIN.')
    response.gather({
      numDigits: 4,
      action: `${process.env.BASE_URL}/api/voice/validate-pin`,
      method: 'POST'
    })
  } else {
    response.say('Incorrect safe word. Goodbye.')
    response.hangup()
  }

  const xml = response.toString()
  return new Response(xml, {
    headers: { 'Content-Type': 'text/xml' }
  })
}