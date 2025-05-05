import twilio from 'twilio'
import bcrypt from 'bcryptjs'
import db from '@/utils/db'
import { getUserByEmail } from './userActions'
import { DemoSignupFormSchema, FormState } from '@/lib/schemata'

// Initiate the authentication call from Twilio.
const initiateCall = async (phoneNumber: string) => {
  if (!phoneNumber) throw new Error('No phone number was provided to the initiateCall function.')

  // Instantiate the Twilio instance.
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  try {
    const call = await client.calls.create({
      to: phoneNumber, // -> string with `+` prefix.
      from: process.env.TWILIO_PHONE_NUMBER!,
      url: `${process.env.BASE_URL}/api/voice/voice-entry`,
      method: 'POST'
    })
    return call
  } catch (err) {
    console.error('Call failed:', err)
    throw new Error('FAiled to initiate the call.')
  }
}

// Register a user.
export const demoSignup = async (state: FormState, formData: FormData): Promise<FormState> => {
  // 1a. Validate form fields.
  const validatedFields = DemoSignupFormSchema.safeParse({
    // name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // 1b. If any form fields are invalid, return early.
  if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors }

  // 2. Prepare data for insertion into database.
  const { email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Check if the user already exists.
  const existingUser = await db.user.findUnique({ where: { email }})

  if (existingUser) return { errors: { email: ['This email has already been registered.'] }}

  // 3. Insert the user into the database.
  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: { id: true, email: true, role: true }
  })


  // 6. Return a success message.
  return { message: 'Welcome to the Phone & Pin demo', user: newUser }
}

// Log a demo user in: no real auth, just email and password validation checks. 
export const demoLogin = async (state: FormState, formData: FormData): Promise<FormState> => {
  // Validate form fields.
  const validateFields = DemoSignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  // Get the user from the db.
  const { email, password } = validateFields.data
  const user = await getUserByEmail(email)
  if (!user) return { errors: { email: ['This email is not registered.'] } }

  // Check if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { errors: { password: ['The password is incorrect.'] } }

  // Initiate the auth phone call.
  if (user?.phone) initiateCall(user.phone)
  else return { errors: { phone: ['Please add a phone number to your profile to complete the sign-in procedure.']}}

  // Return success to initiate the redirect to the /demo/start page.
  return { message: 'success' }
}
