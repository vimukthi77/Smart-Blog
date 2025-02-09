import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}
