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
}

export type PostFormValues = {
  title: string
  content: string
  categoryId: string
  imageUrl: File
}
