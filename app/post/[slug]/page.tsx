import { PostContent } from '@/features/post/components/atomics/PostContent'
import { getPostBySlug } from '@/features/post/post.controller'
import { formatDate } from '@/utils/formatDate'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  }
  const { title, content, publishedAt, imageUrl, author, category } = post

  return (
    <article className="prose-custom dark:prose-invert prose-headings:scroll-mt-20 mx-auto max-w-3xl px-4 py-12">
      <h1>{title}</h1>
      {(publishedAt || author || category?.name) && (
        <p className="text-muted-foreground text-sm">
          {publishedAt && `Dipublikasikan pada ${formatDate(publishedAt)}`} ·{' '}
          {author || 'Anonim'} · {category?.name}
        </p>
      )}
      {imageUrl && (
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="w-full rounded-md object-cover"
          />
        </div>
      )}
      {content ? (
        <PostContent htmlContent={content} />
      ) : (
        <p className="text-muted-foreground italic">Konten tidak tersedia.</p>
      )}{' '}
    </article>
  )
}
