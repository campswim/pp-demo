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

export const signup = async (state: FormState, formData: FormData) => {
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

  if (existingUser) return { errors: { email: ['Email is already registered.'] }}

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

  // 6. Redirect to the dashboard.
  redirect('/login')
}

export const login = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json()
    const user = await db.user.findUnique({ where: { email } })

    console.log({email, password, user})

    if (!user || !user.password) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return NextResponse.json({ message: 'Invalid password' }, { status: 401 });

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h'})

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ message: 'Iinternal Server Error' }, { status: 500 })
  }
}
