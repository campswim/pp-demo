'use server'

import db from '@/utils/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { User } from '@/generated/prisma'
import { SignupFormSchema, FormState, JWTPayload, Cookie } from '@/lib/schemata'
import { UserActionsProps } from '@/lib/types'
import { generateAccessToken, generateRefreshToken, validateAuthCookie } from './auth'
import { getCookie, setCookie, deleteCookie } from './cookie'

// Get user by ID.
export const getUserById = async (id: string) => {
  if (!id) throw new Error('No ID was provided to the get-user-by-id function.')
  return await db.user.findUnique({ where: { id } })
}

// Get user by email.
export const getUserByEmail = async (email: string) => {
  if (!email) throw new Error('No email was provided to the get-user-by-email function.')
  return await db.user.findUnique({ where: { email }})
}

// Get all users from the database.
export const getUsers = async (role: string): Promise<User[]> => {
  if (!role || role !== 'admin') throw new Error(`Your role of ${role} does not provide access to this resource.`)
  return await db.user.findMany()
}

// Create a single user in the database.
export const createUser = async (prevState: UserActionsProps, formData: FormData): Promise<UserActionsProps> => {
  type NewUser = Omit<User, 'id' | 'loggedIn' | 'createdAt' | 'updatedAt'>

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
  await setCookie('auth', accessToken)
  await setCookie('refresh', refreshToken)

  return { user, message: 'Welcome back'}
}

// Log a user out.
export const logout = async (id: string | null = null): Promise<void> => {
  if (!id) throw new Error('No ID was provided to the logout method.')
  
  // Clear the access and refresh cookies.
  try {
    await deleteCookie('auth');
    await deleteCookie('refresh')
    await deleteCookie('user-id')

    // Mark the user as logged out in the db.
    await db.user.update({
      where: { id: id || undefined },
      data: { loggedIn: false }
    })

  } catch (err) {
    console.warn('Logout failed: ', err)
  }

  // redirect('/login')
}

// Get the user's session.
export const getUserSession = async (): Promise<JWTPayload | null> => {
  const authCookie: Cookie | null = await getCookie('auth')
  const user: JWTPayload | null = await validateAuthCookie(authCookie)
  return user ?? null
}