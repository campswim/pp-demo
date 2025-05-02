import bcrypt from "bcryptjs"
import db from '@/utils/db'
import { getUserByEmail } from "./userActions"
import { SignupFormSchema, FormState } from '@/lib/schemata'

// Log a demo user in: no real auth, just email and password validation checks. 
export const demoLogin = async (state: FormState, formData: FormData): Promise<FormState> => {
  // 1a. Validate form fields.
  const validateFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // 1b. If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  // 2. Get the user from the db.
  const { email, password } = validateFields.data
  const user = await getUserByEmail(email)
  if (!user) return { errors: { email: ['This email is not registered.'] } }

  // 3. Check if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { errors: { password: ['The password is incorrect.'] } }

  // 5. Mark the user as logged in.
  await db.user.update({
    where: { id: user.id },
    data: { loggedIn: true }
  })

  return { user, message: 'success' }
}
