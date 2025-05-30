import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const publishedAt = formData.get('publishedAt') as string
  const author = formData.get('author') as string
  const file = formData.get('image') as File

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()
    const fileName = `${uuid()}.${ext}`
    const filePath = path.join(process.cwd(), 'public/uploads', fileName)
    fs.writeFileSync(filePath, buffer)

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        image: `/uploads/${fileName}`,
        category,
        publishedAt: new Date(publishedAt),
        author,
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('Error saat membuat post:', err)
    return NextResponse.json({ error: 'Gagal membuat post' }, { status: 500 })
  }
}
