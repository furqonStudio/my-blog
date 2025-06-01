import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { PostStatus } from '@/app/generated/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      publishedAt: true,
      content: true,
      author: true,
      category: true,
      status: true,
    },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = formData.get('title')
    const content = formData.get('content')
    const categoryId = formData.get('categoryId')
    const file = formData.get('imageUrl')
    const status = formData.get('status')

    if (typeof status !== 'string') {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
    }

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof categoryId !== 'string' ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        { error: 'Data tidak lengkap atau tidak valid' },
        { status: 400 },
      )
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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${uuid()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public/uploads')

    fs.mkdirSync(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    const imagePath = `/uploads/${fileName}`

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const publishedAt = new Date()
    const author = 'Furqon'

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        category: {
          connect: { id: categoryId },
        },
        publishedAt,
        author,
        imageUrl: imagePath,
        status: status as PostStatus,
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('❌ Error saat membuat post:', err)
    return NextResponse.json({ error: 'Gagal membuat post' }, { status: 500 })
  }
}
