import { createPost } from '@/features/post/post.controller'
import { createPostSchema } from '@/features/post/post.schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const title = formData.get('title') as string | null
    const content = (formData.get('content') as string) || ''
    const status = (formData.get('status') as string) || 'DRAFT'
    const categoryId = formData.get('categoryId') as string | undefined
    const imageFile = formData.get('image') as File | null

    // Persiapkan image buffer dan ext
    let imageBuffer: Buffer | null = null
    let imageExt: string | null = null

    if (imageFile && imageFile.size > 0) {
      imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      imageExt = '.' + imageFile.name.split('.').pop()
    }

    // Validasi pakai Zod (berikan image info juga jika diperlukan)
    const validation = createPostSchema.safeParse({
      title,
      content,
      status,
      categoryId,
      imageFile,
    })

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten() },
        { status: 400 },
      )
    }

    // Kirim data ke controller
    const post = await createPost({
      title: title ?? undefined,
      content,
      status: status as 'DRAFT' | 'PUBLISHED',
      categoryId: categoryId ?? undefined,
      imageBuffer,
      imageExt
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    )
  }
}
