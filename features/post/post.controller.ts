import { generateFallbackTitle } from '@/features/post/utils/generateFallbackTitle'
import { generateUniqueSlug } from '@/features/post/utils/generateSlug'
import prisma from '@/lib/prisma'
import { saveImageToPublic } from '@/utils/saveImageToPublic'

type CreatePostInput = {
  title?: string
  content?: string
  status: 'DRAFT' | 'PUBLISHED'
  categoryId?: string
  imageBuffer?: Buffer
  imageExt?: string
  author?: string
}

export const getPosts = async () => {
  return await prisma.post.findMany({
    orderBy: { publishedAt: 'asc' },
    include: {
      category: true,
    },
  })
}

export async function createPost(input: CreatePostInput) {
  const {
    title,
    content = '',
    status,
    categoryId,
    imageBuffer,
    imageExt,
    author = 'Furqon',
  } = input

  const finalTitle =
    status === 'DRAFT' && (!title || title.trim() === '')
      ? generateFallbackTitle(content)
      : title?.trim() || 'Untitled'

  const slug = await generateUniqueSlug(finalTitle)

  const imageUrl =
    imageBuffer && imageExt
      ? await saveImageToPublic(imageBuffer, imageExt)
      : null

  const publishedAt = status === 'PUBLISHED' ? new Date() : null

  const post = await prisma.post.create({
    data: {
      title: finalTitle,
      slug,
      content: content.trim(),
      status,
      categoryId: categoryId ?? null,
      author,
      imageUrl,
      publishedAt,
    },
  })

  return post
}
