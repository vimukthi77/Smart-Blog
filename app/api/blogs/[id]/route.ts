import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

// Get single blog post
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}

// Delete blog post

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    console.log('Delete request received for ID:', params.id)
    
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1]
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      const decodedToken = verifyToken(token)
      const post = await prisma.post.delete({
        where: { id: params.id }
      })
  
      return NextResponse.json({ success: true, post })
    } catch (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
  }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string
    const image = formData.get('image') as File | null
    const published = formData.get('published') === 'true'

    let imagePath = undefined
    if (image) {
      try {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        
        try {
          await mkdir(uploadDir, { recursive: true })
          await writeFile(join(uploadDir, filename), buffer)
          imagePath = `/uploads/${filename}`
        } catch (error) {
          console.error('File system error:', error)
          throw new Error('Failed to save image')
        }
      } catch (error) {
        console.error('Image processing error:', error)
        throw new Error('Failed to process image')
      }
    }

    const post = await prisma.post.update({
      where: { 
        id: params.id,
        authorId: decodedToken.userId 
      },
      data: {
        title,
        content,
        category,
        tags: tagsString ? JSON.parse(tagsString) : [],
        ...(imagePath && { image: imagePath }),
        published
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Post updated successfully',
      post 
    })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Failed to update post' 
    }, { status: 500 })
  }
}
