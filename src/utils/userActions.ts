'use server'

import db from '@/utils/db'
import { revalidatePath } from 'next/cache'

interface User {
  email: string
  password: string
}

interface CreaeUserFormState {
  success?: boolean
  error?: string | null
}

export const getUsers = async () => {
  'use server'
  const users = await db.user.findMany()
  return users
}

export const createUser = async (prevState: CreaeUserFormState, formData: FormData): Promise<CreaeUserFormState> => {
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