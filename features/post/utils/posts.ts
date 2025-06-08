import { BasePost, PublishedPost } from '../post.type'

export const mapToPublishedPost = (post: BasePost): PublishedPost => {
  return {
    ...post,
    category: post.category?.name ?? 'Uncategorized',
    title: post.title ?? '',
    content: post.content ?? '',
    publishedAt: post.publishedAt ?? new Date(),
    author: post.author ?? '',
    imageUrl: post.imageUrl ?? '',
  }
}
export function getSmartTruncatedContent(
  html: string,
  maxLength: number = 150,
) {
  const plain = html.replace(/<[^>]+>/g, '')
  if (plain.length <= maxLength) return plain
  const truncated = plain.slice(0, maxLength)
  return truncated.slice(0, truncated.lastIndexOf(' ')) + '...'
}
