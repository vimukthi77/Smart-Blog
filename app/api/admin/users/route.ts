import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
