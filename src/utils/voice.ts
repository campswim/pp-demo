import twilio from 'twilio'
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

  console.log({userInfo})

  // Get the user and user's phone number.
  const user = userInfo && userInfo?.userId ? await getUserById(userInfo.userId) : null
  const phone = user?.phone ?? null
  if (!phone) throw new Error('No phone number was provided to the initiateCall function.')
  
  console.log({phone})

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
      method: 'POST'
    })
    return call
  } catch (err) {
    console.error('Call failed:', err)
    throw new Error('Failed to initiate the call.')
  }
}
