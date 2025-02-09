import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string || '[]'
    const image = formData.get('image') as File | null
    const published = formData.get('published') === 'true'

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tags = JSON.parse(tagsString)

    let imagePath = ''
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${image.name}`
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const path = join(uploadDir, filename)
      await writeFile(path, buffer)
      imagePath = `/uploads/${filename}`
    }

    const decodedToken = verifyToken(token)
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        tags,
        image: imagePath,
        published,
        authorId: decodedToken.userId
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
