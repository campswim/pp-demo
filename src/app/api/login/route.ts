import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/utils/db'

const secretKey = process.env.JWT_SECRET as string

export async function POST(req: NextRequest) {
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