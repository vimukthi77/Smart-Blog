import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || undefined
  const tags = searchParams.get('tags')?.split(',') || []
  const excludeId = searchParams.get('exclude') || undefined

  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          category ? { category } : {},
          { tags: { hasSome: tags } },
          excludeId ? { id: { not: excludeId } } : {},
          { published: true }
        ]
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        image: true,
        category: true
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch related posts' },
      { status: 500 }
    )
  }
}