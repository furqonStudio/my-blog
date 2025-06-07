import { generateFallbackTitle } from '@/features/post/utils/generateFallbackTitle'
import { generateUniqueSlug } from '@/features/post/utils/generateSlug'
import prisma from '@/lib/prisma'
import { saveImageToPublic } from '@/utils/saveImageToPublic'

type PostInput = {
  title?: string
  content?: string
  status: 'DRAFT' | 'PUBLISHED'
  categoryId?: string
  imageBuffer?: Buffer
  imageExt?: string
}

export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      status: true,
      imageUrl: true,
      publishedAt: true,
      author: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  return posts.map((post) => ({
    ...post,
    category: post.category?.name ?? null,
  }))
}

export async function createPost(input: PostInput) {
  const {
    title,
    content = '',
    status,
    categoryId,
    imageBuffer,
    imageExt,
  } = input

  const author = 'Furqon'
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

export async function updatePost(id: number, input: PostInput) {
  const { title, content, status, categoryId, imageBuffer, imageExt } = input

  const imageUrl =
    imageBuffer && imageExt
      ? await saveImageToPublic(imageBuffer, imageExt)
      : null

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(status && {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      }),
      categoryId: categoryId ?? undefined,
      ...(imageUrl && { imageUrl }),
    },
  })

  return updated
}

export const deletePost = async (id: number) => {
  return await prisma.post.delete({
    where: { id },
  })
}
