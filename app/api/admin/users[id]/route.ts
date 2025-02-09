import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { role } = await request.json()
  const id = context.params.id
    
  const user = await prisma.user.update({
    where: { id },
    data: { role }
  })

  return NextResponse.json(user)
}
