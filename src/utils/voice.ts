import twilio from 'twilio'
import db from '@/utils/db'
import { decrypt } from '@/utils/encrypt-decrypt'
import { getUserById } from '@/utils/userActions'
import { validateAuthCookie } from '@/utils/auth'
import { getCookie } from '@/utils/cookie'
import { formatToE164 } from '@/utils/helpers'
import type { Cookie } from '@/lib/schemata'

// Initiate the authentication call from Twilio.
export const initiateCall = async () => {  
  // Get the auth cookie in order to retrieve the user's phone number.
  const authCookie: Cookie | null = await getCookie('auth')
  const userInfo = authCookie ? await validateAuthCookie(authCookie) : null
  if (!userInfo) throw new Error('This session is not valid.')

  // Get the user and user's phone number.
  const user = userInfo && userInfo?.userId ? await getUserById(userInfo.userId) : null
  const phone = user?.phone ?? null
  if (!phone) throw new Error('No phone number is associated with the current user.')
  
  // Decrypt the phone number.
  const phoneDecrypted = decrypt(phone)
  if (!phoneDecrypted) throw new Error('Decrypting the phone number failed.')

  // Format the user's phone number for E.164.
  const phoneFormatted = formatToE164(phoneDecrypted)
  if (!phoneFormatted) throw new Error('Formatting the phone number failed.')

  // Instantiate the Twilio instance.
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  try {
    const call = await client.calls.create({
      to: phoneFormatted, // -> string with `+` prefix.
      from: process.env.TWILIO_PHONE_NUMBER!,
      url: `${process.env.BASE_URL}/api/voice/voice-entry`,
      method: 'POST',
      statusCallback: `${process.env.BASE_URL}/api/voice/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    })

    await db.voiceCall.upsert({
      where: { callSid: call.sid },
      update: { status: call.status },
      create: {
        userId: userInfo.userId,
        callSid: call.sid,
        status: call.status,
      }
    })

    return call
  } catch (err) {
    console.error('Call failed:', err)
    throw new Error('Failed to initiate the call.')
  }
}

export const getSafeWord = async (callSid: string | null): Promise<string | null> => {
  if (!callSid) throw new Error('No call SID was sent to getSafeWord.')
  try {
    const voiceCall = await db.voiceCall.findUnique({ 
      where: { callSid }, 
      include: { user: { select: { safeword: true } } } 
  })

    const safewordDecrypted = voiceCall?.user?.safeword ? decrypt(voiceCall.user.safeword) : null
    return safewordDecrypted
  } catch (err) {
    console.warn('getSafeWord failed:', err)
    return null
  }
}

export const getPin = async (callSid: string | null): Promise<string | null> => {
  if (!callSid) throw new Error('No call SID was sent to getPin.')

    try {
      const voiceCall = await db.voiceCall.findUnique({
        where: { callSid },
        include: { user: { select: { pin: true } } }
      })
      
      return voiceCall?.user?.pin ??  null
    } catch (err) {
      console.warn('getPin failed:', err)
      return null
    }
}