import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt for:', email)

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log('User found, role:', user.role)
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      console.log('Password mismatch for:', email)
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET || 'default-secret-key'
    )

    console.log('Login successful for:', email)
    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      message: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
