'use server'

import db from '@/utils/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@/generated/prisma'
import { SignupFormSchema, FormState } from '@/lib/definitions'

interface Props {
  success?: boolean
  error?: string | null
}

export const getUsers = async (): Promise<User[]> => {
  const users = await db.user.findMany()
  return users
}

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

export const signup = async (state: FormState, formData: FormData): Promise<FormState> => {
  const secretKey = process.env.JWT_SECRET
  if (!secretKey) throw new Error('JWT_SECRET is not defined in environment variables.')

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

  if (existingUser) return { errors: { email: ['This email has already registered.'] }}

  // 3. Insert the user into the database.
  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: { id: true, email: true, role: true }
  })

  // 4. Generate a JWT token.
  const token: string = jwt.sign({ userId: newUser.id, email: newUser.email }, secretKey, { expiresIn: '1h' })

  // 5. Set the token in cookies.
  const cookieStore = await cookies()
  cookieStore.set('auth', JSON.stringify(
    {
      id: newUser.id,
      loggedIn: true,
      role: newUser.role,
      token
    }
  ), {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax'
  })

  // 6. Return a success message.
  return { message: 'Welcome to the Phone & Pin demo', user: newUser }
}

export const login = async (state: FormState, formData: FormData): Promise<FormState> => {
  const secretKey = process.env.JWT_SECRET
  if (!secretKey) throw new Error('JWT_SECRET is not defined in environment variables.')

  // 1a. Validate form fields.
  const validateFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // 1b. If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  // 2. Get the user from the db.
  const { email, password } = validateFields.data
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, password: true, role: true } })
  if (!user) return { errors: { email: ['This email is not registered.'] } }

  // 3. Check if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { errors: { password: ['The password is incorrect.'] } }

  // 4. Generate a JWT token.
  const token: string = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' })

  // 5. Mark the user as logged in.
  await db.user.update({
    where: { id: user.id },
    data: { loggedIn: true }
  })

  // 6. Set the token in cookies.
  const cookieStore = await cookies()
  cookieStore.set('auth', JSON.stringify(
    {
      id: user.id,
      loggedIn: true,
      role: user.role,
      token
    }
  ))

  // 6. Return a success message.
  return { message: 'Welcome back to the Phone & Pin demo', user }

}

export const logout = async () => {

  console.log('ian in logout')

  // Instantiate the cookie store.
  const cookieStore = await cookies()

  // Get the user from the cookie.
  const authCookie = cookieStore.get('auth')

  // If there is no coookie, the user isn't logge in.
  if (!authCookie) return { message: 'There is no auth cookie.' }
  
  // Parse the cookie value.
  const authData = JSON.parse(authCookie.value)

  console.log({authData})

  // If the cookie exists but loggedIn has been set to false, the user isn't logged in.
  if (!authData.loggedIn) return { message: 'You are already logged out.' }

  // Get the userId from the cookie to use in indicating that the user is logged out.
  const userId = authData.id

  // Get the email from the db and the username from the email.
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
  const username = user?.email ? user?.email?.split('@')[0] : '';

  console.log({username})

  // Clear the cookie.
  cookieStore.delete('auth');
  
  // Mark the user as logged out in the db.
  await db.user.update({
    where: { id: userId },
    data: { loggedIn: false }
  })

  // Relay the logout message.
  return { message: `See you next time${username ? ', ' + username[0].toUpperCase() + username.slice(1) : ''}.` }
}