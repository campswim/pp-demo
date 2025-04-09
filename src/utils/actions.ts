'use server'

import { prisma } from '@/lib/prisma'

export type User = {
  username: string
  password: string
  email: string
}

export const createUser = async (formData: FormData) => {
  'use server'

  const user: User = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    email: formData.get('email') as string,
  }

  const userToDb = await prisma.user.create({
    data: { user }
  })

  console.log({userToDb});
}