'use server'

import db from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@/generated/prisma'

interface Props {
  success?: boolean
  error?: string | null
}

export const getUsers = async (): Promise<User[]> => {
  'use server'
  const users = await db.user.findMany()

  return users
}

export const createUser = async (prevState: Props, formData: FormData): Promise<Props> => {
  'use server'

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
  'use server'

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

export const login = async (formData: FormData) => {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log({email, password})
  
  // Find the user by email.
  const user = await db.user.findUnique({
    where: { email },
  })
  
  if (!user || user.password !== password) {
    // TODO: Add hashed password comparison and error handling
    throw new Error('Invalid email or password');
  }
  
  (await cookies()).set('auth', JSON.stringify({ id: user.id, loggedIn: true, role: user.role }), {
    httpOnly: true,
    path:'/',
    secure: true,
    sameSite: 'lax'
  })

  redirect('/')
}