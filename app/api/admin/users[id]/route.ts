import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { role } = await request.json()
  const id = params.id
    
  const user = await prisma.user.update({
    where: { id },
    data: { role }
  })

  return NextResponse.json(user)
}
