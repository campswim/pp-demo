import { NextRequest } from 'next/server'
import { twiml } from 'twilio'
import { setPin } from '@/utils/voice' // similar to setSafeWord

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const retryCount = Number(url.searchParams.get('retry') || '0')
  const formData = await req.formData()
  const callSid = formData.get('CallSid')?.toString() ?? null
  const digits = formData.get('Digits')?.toString() ?? null
  const response = new twiml.VoiceResponse()

  if (!digits) {
    // First time: prompt for PIN.
    const gather = response.gather({
      numDigits: 4,
      action: `${process.env.BASE_URL}/api/voice/record-pin`, 
      method: 'POST',
      timeout: 10
    })
    gather.say('Please enter your 4-digit PIN using the keypad.')
  } else {
    // User submitted digits
    if (digits.length === 4 && /^\d{4}$/.test(digits)) {
      await setPin(callSid, digits)
      response.say('Thank you. Your PIN has been recorded. You will now be redirected to your account.')
      response.hangup()

      // Redirect to the account page.
      
    } else {
      // Retry
      response.say('Invalid input. Please enter exactly 4 digits.')
      response.redirect(`${process.env.BASE_URL}/api/voice/record-pin?retry=${retryCount + 1}`)
    }
  }

  return new Response(response.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' }
  })
}