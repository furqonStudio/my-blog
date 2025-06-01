export type Post = {
  id: number
  title: string
  slug: string
  image: string
  publishedAt: Date
  content: string
  category: {
    id: string
    name: string
  }
  author: string | null
}
