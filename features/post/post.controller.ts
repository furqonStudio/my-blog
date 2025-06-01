import prisma from '@/lib/prisma'
import { generateSlug } from '@/features/post/utils/generateSlug'

type CreatePostInput = {
  title?: string
  content?: string
  status: 'DRAFT' | 'PUBLISHED'
  categoryId?: string | null
  imageBuffer?: Buffer | null
  imageExt?: string | null
}

export async function createPost(input: CreatePostInput) {
  let { title, content = '', status, categoryId, imageBuffer, imageExt } = input

  // Handle draft title auto generate
  if (status === 'DRAFT' && (!title || title.trim() === '')) {
    title =
      content.trim() !== ''
        ? content.trim().slice(0, 20) + (content.length > 20 ? '...' : '')
        : `draft-post-${Date.now()}`
  }

  const slug = generateSlug(title ?? 'untitled')

  // Upload image to /public/uploads if imageBuffer and imageExt exist
  let imageUrl = null
  if (imageBuffer && imageExt) {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const { v4: uuidv4 } = await import('uuid')

    const fileName = `${uuidv4()}${imageExt}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await fs.writeFile(filePath, imageBuffer)
    imageUrl = `/uploads/${fileName}`
  }

  const publishedAt = status === 'PUBLISHED' ? new Date() : null
  console.log('🚀 ~ createPost ~ imageUrl:', imageUrl)

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      status,
      categoryId,
      author: 'furqon',
      imageUrl,
      publishedAt,
    },
  })

  return post
}
