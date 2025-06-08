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
