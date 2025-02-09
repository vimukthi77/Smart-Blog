import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    
    const posts = await prisma.post.findMany({
      where: {
        authorId: decodedToken.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
