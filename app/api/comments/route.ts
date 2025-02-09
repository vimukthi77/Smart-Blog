import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { content, postId } = await request.json()
    const decodedToken = verifyToken(token)

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: decodedToken.userId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ message: 'Failed to create comment' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const postId = url.searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ message: 'Post ID required' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(comments)
}
