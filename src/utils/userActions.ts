'use server'

import db from '@/utils/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { User } from '@/generated/prisma'
import { SignupFormSchema, LoginFormSchema, FormState, JWTPayload, Cookie } from '@/lib/schemata'
import { UserActionsProps } from '@/lib/types'
import { generateAccessToken, generateRefreshToken, refreshAccessToken, refreshRefreshToken, validateAuthCookie, validateRefreshCookie } from './auth'
import { getCookie, setCookie, deleteCookie, parseCookieValue } from './cookie'
import { encrypt } from './encrypt-decrypt'
import { clearCallCacheForUser } from '@/utils/call-limiter' 

// Get user by ID.
export const getUserById = async (id: string): Promise<Partial<User> | null> => {
  if (!id) throw new Error('No ID was provided to the get-user-by-id function.')
  const user = await db.user.findUnique({ 
    where: { id }, 
    include: { voiceCalls: true } 
  })
  return user
}

// Get user by username.
export const getUserByUsername = async(username: string) => {
  if (!username) throw new Error('No username was provided to the get-user-by-username function.')
    return await db.user.findUnique({ where: { username }})
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
      username: formData.get('username') as string,
      role: formData.get('role') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      safeword: formData.get('safeword') as string,
      pin: formData.get('pin') as string,
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
    username: typeof formData.get('username') === 'string' ? (formData.get('username') as string).toLowerCase() : '',
    phone: formData.get('phone'),
    password: formData.get('password'),
    // safeword: formData.get('safeword'),
    // pin: Number(formData.get('pin'))
  })

  // 1b. If any form fields are invalid, return early.
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  // 2. Prepare data for insertion into database.
  const { 
    username, 
    phone, 
    password,
    // safeword,
    // pin
  } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)
  const encryptedPhone = encrypt(phone)
  // const encryptedSafeword = encrypt(safeword)
  // const encryptedPin = encrypt(pin.toString())

  // 3. Check if the user already exists.
  const existingUser = await db.user.findUnique({ where: { username }})

  if (existingUser) return { errors: { username: ['This username has already been registered.'] }}

  // 3. Insert the user into the database.
  const newUser = await db.user.create({
    data: {
      username,
      password: hashedPassword,
      phone: encryptedPhone,
      loggedIn: true,
      // safeword: encryptedSafeword,
      // pin: encryptedPin
    },
    select: { 
      id: true, 
      username: true,
      role: true 
    }
  })

  if (!newUser) {
    return { message: 'Something went wrong while creating your account.' }
  }

  // 4. Generate the access and refresh tokens.
  const payload = {
    userId: newUser.id,
    username: newUser.username,
    role: newUser.role
  }
  const accessToken: string = await generateAccessToken(payload)
  const refreshToken: string = await generateRefreshToken(payload)

  // 5. Set the access and refresh tokens in cookies.
  await setCookie('auth', accessToken)
  await setCookie('refresh', refreshToken)

  // 6. Redirect to the homepage, indicating a registration in the URL for the welcome message.
  // redirect('/user/home/?register=true')
  redirect(`/user/register-creds?user=${newUser.id}`)
}

// Log a user in.
export const login = async (state: FormState, formData: FormData): Promise<FormState> => {
  // 1a. Validate form fields.
  const validateFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  // 1b. If any form fields are invalid, return early.
  if (!validateFields.success) return { errors: validateFields.error.flatten().fieldErrors }

  // 2. Get the user from the db.
  const { username, password } = validateFields.data
  const user = await getUserByUsername(username.toLowerCase())

  if (!user) return { errors: { username: [`The username "${username}" is not registered.`] } }

  // 3. Check if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { errors: { password: ['The password is incorrect.'] } }

  // 4. Generate access and refresh tokens.
  const payload = {
    userId: user.id,
    username: user.username,
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

  // 6. Reirect to the homepage, indicating a login in the URL for the welcome message.
  redirect('/user/home?login=true')
}

// Log a user out.
export const logout = async (id: string | null = null): Promise<void> => {
  if (!id) throw new Error('No ID was provided to the logout method.')
  
  // Clear the user's session.
  try {
    await deleteUserSession(id)
  } catch (err) {
    console.warn('Logout failed: ', err)
  }

  redirect('/user/login')
}

// Get the user's session in server components.
export const getUserSession = async (): Promise<JWTPayload | null> => {
  const authCookie = await getCookie('auth')
  return authCookie ? await validateAuthCookie(authCookie) : null
}

// Get the user's session.
export const getUserSessionWithRefresh = async (): Promise<JWTPayload | null> => {
  const authCookie: Cookie | null = await getCookie('auth') ?? null
  let user: JWTPayload | null = authCookie ? await validateAuthCookie(authCookie) : null

  if (user) return user
  
  const refreshCookie: Cookie | null = await getCookie('refresh')
  const refreshUser: JWTPayload | null = refreshCookie ? await validateRefreshCookie(refreshCookie) : null

  if (!refreshUser) {
    const parsed = await parseCookieValue('auth', true)
    const expiredUserId: string | null = parsed && typeof parsed?.userId == 'string' ? parsed.userId : null

    deleteUserSession(expiredUserId)
  } else {
    const newAccessToken = await refreshAccessToken(refreshUser)
    const newRefreshToken = await refreshRefreshToken(refreshUser)

    if (newAccessToken && newRefreshToken) {
      setCookie('auth', newAccessToken)
      setCookie('refresh', newRefreshToken)

      user = refreshUser
    }
  }

  return user ?? null
}

// Delete the user's session and cookies.
export const deleteUserSession = async (userId: string | null = null): Promise<void> => {  
  // To-do: Check to see whether the user still exists in the DB.

  // Delete the user-related cookies.
  await deleteCookie('auth')
  await deleteCookie('refresh')
  await deleteCookie('user-id')
  
  if (userId) {
    // Clear the call cache for the user.
    clearCallCacheForUser(userId)
    
    // Mark the user as logged out in the db.
    await db.user.update({
      where: { id: userId },
      data: { loggedIn: false }
    })
  }
}