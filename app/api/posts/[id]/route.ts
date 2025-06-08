import {
  deletePost,
  getPostById,
  updatePost,
} from '@/features/post/post.controller'
import { getFormFile, getFormString } from '@/utils/form'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const post = await getPostById(Number(id))

    if (!post) {
      return NextResponse.json(
        { error: 'Post tidak ditemukan' },
        { status: 404 },
      )
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil post' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 },
      )
    }

    await deletePost(Number(id))

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const formData = await req.formData()

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

    const updated = await updatePost(Number(id), {
      title,
      content,
      status: status as 'DRAFT' | 'PUBLISHED',
      categoryId,
      imageBuffer,
      imageExt,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 },
    )
  }
}
