import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      publishedAt: true,
      content: true,
      author: true,
      category: true,
    },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const publishedAt = new Date()
    const author = 'Furqon'
    const file = formData.get('image') as File | null

    if (!title || !content || !category || !file) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File harus berupa gambar' },
        { status: 400 },
      )
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran gambar maksimal 2MB' },
        { status: 400 },
      )
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

    let categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: category },
      })
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        category: {
          connect: { id: categoryRecord.id },
        },
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
