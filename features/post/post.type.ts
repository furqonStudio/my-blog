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

export type PostFormValues = {
  title: string
  content?: string
  imageUrl?: string
  categoryId?: string
  status: PostStatus
}
