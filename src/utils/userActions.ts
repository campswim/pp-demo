'use server'

import db from '@/utils/db'
import { revalidatePath } from 'next/cache'

interface User {
  email: string
  password: string
}

interface CreateUserFormState {
  success?: boolean
  error?: string | null
}

export const getUsers = async () => {
  'use server'
  const users = await db.user.findMany()
  return users
}

export const createUser = async (prevState: CreateUserFormState, formData: FormData): Promise<CreateUserFormState> => {
  'use server'

  try {
    const user: User = {
      email: formData.get('email') as string,
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

  // Find the user by email.
  const user = await db.user.findUnique({
    where: { email }
  })

  if (!user) return { success: false, error: 'User not found.' }

  // Verify the password.
  const isPasswordValid = password === user.password // Replace with actual password hashing and comparison logic

  if (!isPasswordValid) return { success: false, error: 'Invalid password.' }

  
}