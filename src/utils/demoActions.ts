import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import db from '@/utils/db'
import { getUserByUsername } from '@/utils/userActions'
import { DemoSignupFormSchema, FormState } from '@/lib/schemata'

// Register a user. [Not in use: just using the app's registered users.]
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
  if (!isPasswordValid) return { errors: { password: ['The password is incorrect.'] } }

  // Redirect to the /demo/start page.
  redirect('/demo/start')
}
