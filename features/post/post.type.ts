import { Prisma } from '@/app/generated/prisma'

// export type PostDetail = {
//   id: number
//   title: string
//   slug: string
//   imageUrl: string
//   publishedAt: Date
//   content: string
//   category: Category
//   categoryId: string
//   author: string
//   status: PostStatus
// }

export type BasePost = Prisma.PostGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    content: true
    imageUrl: true
    status: true
    publishedAt: true
    author: true
    category: {
      select: {
        name: true
      }
    }
  }
}>

export type Post = Omit<BasePost, 'category'> & {
  category: string | null
}

export type PublishedPost = Omit<BasePost, 'category'> & {
  category: string
  title: string
  content: string
  publishedAt: Date
  author: string
  imageUrl: string
}

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    category: true
  }
}>

export type PostInput = {
  title?: string
  content?: string
  status: 'DRAFT' | 'PUBLISHED'
  categoryId?: string
  imageBuffer?: Buffer
  imageExt?: string
}
