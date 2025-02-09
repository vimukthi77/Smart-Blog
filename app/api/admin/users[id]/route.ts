import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (decodedToken.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { role } = await request.json()
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  }
}
