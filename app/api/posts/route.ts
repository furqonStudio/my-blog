import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { postSchema, draftSchema } from '@/features/post/post.schema'
import { PostStatus, Prisma } from '@/app/generated/prisma'
import { z } from 'zod'

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

    const status = formData.get('status') as PostStatus | undefined
    let title = formData.get('title')?.toString().trim()

    if (status === PostStatus.DRAFT && (!title || title === '')) {
      title = `Draft Post ${Math.floor(Math.random() * 10000)}`
    }

    const rawData = {
      title,
      content: formData.get('content'),
      categoryId: formData.get('categoryId'),
      imageUrl: formData.get('imageUrl'),
      status,
    }

    let validatedData
    try {
      validatedData =
        status === PostStatus.DRAFT
          ? draftSchema.parse(rawData)
          : postSchema.parse(rawData)
    } catch (err) {
      const zodError = err as z.ZodError
      const errors = zodError.flatten().fieldErrors
      return NextResponse.json(
        { error: 'Validasi gagal', details: errors },
        { status: 400 },
      )
    }

    const {
      title: validatedTitle,
      content,
      categoryId,
      imageUrl,
      status: validatedStatus,
    } = validatedData

    let imagePath: string | null = null
    if (
      imageUrl &&
      imageUrl instanceof File &&
      validatedStatus !== PostStatus.DRAFT
    ) {
      const bytes = await imageUrl.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = imageUrl.name.split('.').pop() ?? 'jpg'
      const fileName = `${uuid()}.${ext}`
      const uploadDir = path.join(process.cwd(), 'public/uploads')

      fs.mkdirSync(uploadDir, { recursive: true })
      const filePath = path.join(uploadDir, fileName)
      fs.writeFileSync(filePath, buffer)

      imagePath = `/uploads/${fileName}`
    } else if (validatedStatus === PostStatus.DRAFT) {
      imagePath = imageUrl && typeof imageUrl === 'string' ? imageUrl : null
    }

    const slug =
      validatedTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') || `untitled-${Date.now()}`

    const publishedAt =
      validatedStatus === PostStatus.PUBLISHED ? new Date() : null

    const author = 'Furqon'

    const dataForCreate: Prisma.PostCreateInput = {
      title: validatedTitle,
      slug,
      content: content!,
      author,
      status: validatedStatus,
      imageUrl: imagePath ?? '',
      publishedAt: publishedAt ?? undefined,
      category: categoryId
        ? { connect: { id: categoryId as string } }
        : undefined,
    }

    const newPost = await prisma.post.create({
      data: dataForCreate,
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('❌ Error saat membuat post:', err)
    return NextResponse.json({ error: 'Gagal membuat post' }, { status: 500 })
  }
}
