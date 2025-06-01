import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { postSchema, draftSchema } from '@/features/post/post.schema'
import { PostStatus, Prisma } from '@/app/generated/prisma'

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

    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      categoryId: formData.get('categoryId'),
      imageUrl: formData.get('imageUrl'),
      status: formData.get('status'),
    }

    const status = rawData.status as PostStatus | undefined

    const parseResult =
      status === PostStatus.DRAFT
        ? draftSchema.safeParse(rawData)
        : postSchema.safeParse(rawData)

    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors
      return NextResponse.json(
        { error: 'Validasi gagal', details: errors },
        { status: 400 },
      )
    }

    const {
      title,
      content,
      categoryId,
      imageUrl,
      status: validatedStatus,
    } = parseResult.data

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

    const slug = title
      ? title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      : null

    const publishedAt =
      validatedStatus === PostStatus.PUBLISHED ? new Date() : null

    const author = 'Furqon'
    const slugValue = slug ?? `untitled-${Date.now()}`

    // Pastikan properti wajib tidak undefined dengan tanda '!'
    const dataForCreate: Prisma.PostCreateInput = {
      title: title!, // sudah pasti ada dari validasi Zod
      slug: slugValue,
      content: content!, // sudah pasti ada
      author,
      status: validatedStatus,
      imageUrl: imagePath ?? '', // fallback ke string kosong jika null
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
