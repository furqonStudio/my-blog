import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const { title, content } = await req.json()
  const post = await prisma.post.create({
    data: { title, content },
  })
  return NextResponse.json(post, { status: 201 })
}
