import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const publishedAt = formData.get('publishedAt') as string
    const author = formData.get('author') as string
    const file = formData.get('image') as File | null

    // Validasi sederhana
    if (!title || !content || !category || !publishedAt || !author) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    let imagePath: string | null = null

    if (file && file.name) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split('.').pop()
      const fileName = `${uuid()}.${ext}`
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      const filePath = path.join(uploadDir, fileName)

      // Pastikan direktori `public/uploads` tersedia
      fs.mkdirSync(uploadDir, { recursive: true })
      fs.writeFileSync(filePath, buffer)

      imagePath = `/uploads/${fileName}`
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        category,
        publishedAt: new Date(publishedAt),
        author,
        image: imagePath ?? '',
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('❌ Error saat membuat post:', err)
    return NextResponse.json({ error: 'Gagal membuat post' }, { status: 500 })
  }
}
