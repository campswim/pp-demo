import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { getUserByUsername } from '@/utils/userActions'
import { DemoSignupFormSchema, FormState } from '@/lib/schemata'

// Log a demo user in: no real auth, just email and password validation checks. 
export const demoLogin = async (state: FormState, formData: FormData): Promise<FormState> => {
  // Validate form fields.
  const validateFields = DemoSignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  // Get the user from the db.
  const { username, password } = validateFields.data
  const user = await getUserByUsername(username)
  if (!user) return { errors: { username: ['This username is not registered.'] } }

  // Check if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { errors: { password: ['is incorrect.'] } }

  // If no safe word and PIN, redirect to /demo/register-creds; else redirect to /demo/start.
  if (!user.safeword || !user.pin) {
    redirect('/demo/register-creds')
  } else {
    redirect('/demo/start')
  }
}

// Log a demo user out: no auth, just redirect to /user/home.
export const demoLogout = async (): Promise<void> => {
  redirect('/user/home')
}