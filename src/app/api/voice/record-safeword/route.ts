import { NextRequest } from 'next/server'
import { twiml } from 'twilio'
import { setSafeWord } from '@/utils/voice'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const retryCount = Number(url.searchParams.get('retry') || '0')
  const formData = await req.formData()
  const callSid = formData.get('CallSid')?.toString() ?? null
  const speechResult = formData.get('SpeechResult')?.toString().trim().toLowerCase()
  const transcript = speechResult?.replace(/[^\w\s]/g, '')
  const response = new twiml.VoiceResponse()

  if (transcript) {
    const safeWord = await setSafeWord(callSid, transcript)

    if (safeWord) {
      // Ask the user to confirm the safe word.
      const gather = response.gather({
        input: ['dtmf'],
        numDigits: 1,
        action: `${process.env.BASE_URL}/api/voice/confirm-safeword?callSid=${callSid}&safeWord=${encodeURIComponent(safeWord)}`,
        method: 'POST'
      })
      gather.say(
        `Thank you. Your safe word, ${safeWord}, has been recorded. ` +
        `If this is correct, press 1; otherwise, press 2 to record your safe word again.`
      )
    } else {
      response.say('There was an error recording your safe word. Please try again.')
    }
  } else {
    response.say("I didn't hear anything. Please try again.")
    response.redirect(`${process.env.BASE_URL}/api/voice/register-creds?retry=${retryCount + 1}`)
  }

  return new Response(response.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' }
  })
}