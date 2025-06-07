import { createPost } from '@/features/post/post.controller'
import { createPostSchema } from '@/features/post/post.schema'
import { getFormFile, getFormString } from '@/utils/form'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const test: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of formData.entries()) {
      test[key] = value
    }

    const title = getFormString(formData, 'title')
    const content = getFormString(formData, 'content')
    const status = getFormString(formData, 'status')
    const categoryId = getFormString(formData, 'categoryId')
    const imageFile = getFormFile(formData, 'image')

    let imageBuffer: Buffer | undefined
    let imageExt: string | undefined

    if (imageFile) {
      imageBuffer = Buffer.from(await imageFile.arrayBuffer())
      imageExt = '.' + imageFile.name.split('.').pop()
    }

    const validation = createPostSchema.safeParse({
      title,
      content,
      status,
      categoryId,
      image: imageFile,
    })

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten() },
        { status: 400 },
      )
    }

    const post = await createPost({
      title,
      content,
      status: status as 'DRAFT' | 'PUBLISHED',
      categoryId,
      imageBuffer,
      imageExt,
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
