export type Post = {
  id: number
  title: string
  slug: string
  image: string
  publishedAt: Date
  content: string
  category: string | null
  author: string | null
}
