import { PostStatus } from '@/app/generated/prisma'
import { Category } from '@/features/categories/category.type'

export type Post = {
  id: number
  title: string
  slug: string
  imageUrl: string
  publishedAt: Date
  content: string
  category: Category
  author: string
  status: PostStatus
}

export type PostDetail = {
  id: number
  title: string
  slug: string
  imageUrl: string
  publishedAt: Date
  content: string
  category: Category
  categoryId: string
  author: string
  status: PostStatus
}
