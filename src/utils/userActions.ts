'use server'

import db from '@/utils/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { User } from '@/generated/prisma'
import { SignupFormSchema, FormState } from '@/lib/definitions'
import { JWTPayload } from './types'
import { generateAccessToken, generateRefreshToken } from './auth'
import { getCookie, setCookie, deleteCookie } from './cookie'

// Define the type for the actions' return object.
interface Props {
  success?: boolean
  error?: string | null
}

// Get user by ID.
export const getUserById = async (id: string) => {
  if (!id) throw new Error('No ID was provided to the get-user-by-email function.')
  return await db.user.findUnique({ where: { id } })
}

// Get user by email.
export const getUserByEmail = async (email: string) => {
  if (!email) throw new Error('No email was provided to the get-user-by-email function.')
  return await db.user.findUnique({ where: { email }})
}

// Get all users from the database.
export const getUsers = async (auth: JWTPayload | null): Promise<User[]> => {
  if (!auth || auth.userRole !== 'admin') throw new Error('Unauthorized')
  return await db.user.findMany()
}

// Create a single user in the database.
export const createUser = async (prevState: Props, formData: FormData): Promise<Props> => {
  type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

  try {
    const user: NewUser = {
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      password: formData.get('password') as string,
    }

    await db.user.create({
      data: { ...user }
    })

    revalidatePath('/admin/users')
    return { success: true, error: null }
  } catch (error) {
    console.error('Error creating user:', error)

    if ((error as { code: string; meta?: { target?: string[] } }).code === 'P2002' && (error as { code: string; meta?: { target?: string[] } }).meta?.target?.includes('email')) {
      return { success: false, error: 'This email is already in use. Please choose another and try again.' }
    }

     // Handle other types of errors
    return { success: false, error: 'User creation failed' }
  }
}

// Delete a single user from the database.
export const deleteUser = async (userId: string) => {
  try {
    await db.user.delete({
      where: { id: userId }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'User deletion failed' }
  }
}

// Register a user.
export const signup = async (state: FormState, formData: FormData): Promise<FormState> => {
  // 1a. Validate form fields.
  const validatedFields = SignupFormSchema.safeParse({
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

  // 4. Generate the access and refresh tokens.
  const payload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  }
  const accessToken: string = await generateAccessToken(payload)
  const refreshToken: string = await generateRefreshToken(payload)

  // 5. Set the access and refresh tokens in cookies.
  await setCookie('auth', accessToken)
  await setCookie('refresh', refreshToken)

  // 6. Return a success message.
  return { message: 'Welcome to the Phone & Pin demo', user: newUser }
}

// Log a user in.
export const login = async (state: FormState, formData: FormData): Promise<FormState> => {
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

  console.log({user});

  // 4. Generate access and refresh tokens.
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }
  const accessToken: string = await generateAccessToken(payload)
  const refreshToken: string = await generateRefreshToken(payload)

  // 5. Mark the user as logged in.
  await db.user.update({
    where: { id: user.id },
    data: { loggedIn: true }
  })

  // 6. Set the access and refresh tokens in cookies.
  await setCookie('auth', accessToken )
  await setCookie('refresh', refreshToken )

  redirect('/')
}

// Log a user out.
export const logout = async () => {
  // Get the user from the cookie.
  const authCookie = await getCookie('auth')

  // If there is no coookie, the user isn't logged in.
  if (!authCookie) return { status: 400, message: 'No auth cookie found.' }

  console.log({authCookie});

  // Parse the cookie value.
  const authCookieResolved = authCookie;
  const authData: JWTPayload | null = authCookieResolved ? JSON.parse(authCookieResolved.value) : null;

  // If the cookie exists but loggedIn has been set to false, the user isn't logged in.
  if (!authData) return { status: 400, message: 'Already logged out.' }

  const username: string = authData?.email ? authData?.email?.split('@')[0] : '';

  // Clear the cookie.
  await deleteCookie('auth');
  
  // Mark the user as logged out in the db.
  await db.user.update({
    where: { id: authData?.id },
    data: { loggedIn: false }
  })

  // // Relay the logout message.
  return { status: 200, message: `See you next time${username ? ', ' + username[0].toUpperCase() + username.slice(1) : ''}.` }
}

// Refresh a user's access token.
export const refreshAccessToken = async () => {
  const refreshTokenCookie = await getCookie('refresh')

  console.log({refreshTokenCookie})
}