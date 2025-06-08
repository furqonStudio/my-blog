import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/utils/formatDate'
import Image from 'next/image'
import Link from 'next/link'
import { PublishedPost } from '../post.type'
import { getSmartTruncatedContent } from '../utils/posts'

type Variant = 'large' | 'small' | 'default'

type Props = {
  post: PublishedPost
  variant?: Variant
}

const PostImage = ({
  imageUrl,
  title,
  className,
}: {
  imageUrl: string
  title: string
  className: string
}) => (
  <div className={className}>
    <Image src={imageUrl} alt={title} fill className="object-cover" />
  </div>
)

const PostMeta = ({
  author,
  publishedAt,
  category,
}: {
  author?: string
  publishedAt: Date
  category?: string
}) => (
  <CardFooter className="flex flex-col items-start gap-1 text-xs text-gray-500">
    <p>
      Oleh {author || 'Anonim'} • {formatDate(publishedAt)}
    </p>
    {category && <p>Kategori: {category}</p>}
  </CardFooter>
)

export const PostCard = ({ post, variant = 'default' }: Props) => {
  const { title, slug, imageUrl, publishedAt, content, category, author } = post
  const truncatedContent = getSmartTruncatedContent(content)

  const linkHref = `/post/${slug}`

  switch (variant) {
    case 'large':
      return (
        <Link href={linkHref}>
          <Card className="w-full pt-0">
            <PostImage
              imageUrl={imageUrl}
              title={title}
              className="relative h-64 overflow-hidden rounded-t-md"
            />
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {truncatedContent.length > 200
                  ? truncatedContent.substring(0, 200) + '...'
                  : truncatedContent}
              </p>
            </CardContent>
            <PostMeta
              author={author}
              publishedAt={publishedAt}
              category={category}
            />
          </Card>
        </Link>
      )

    case 'small':
      return (
        <Link href={linkHref}>
          <Card className="flex w-full flex-row gap-3 overflow-hidden p-0">
            <PostImage
              imageUrl={imageUrl}
              title={title}
              className="relative aspect-[4/3] w-1/3"
            />
            <div className="w-2/3 py-2 pr-2">
              <CardHeader className="p-0 pb-1">
                <CardTitle className="text-sm">{title}</CardTitle>
              </CardHeader>
              <CardFooter className="p-0 text-xs text-gray-500">
                {formatDate(publishedAt)}
              </CardFooter>
            </div>
          </Card>
        </Link>
      )

    default:
      return (
        <Link href={linkHref}>
          <Card className="flex h-[440px] w-full flex-col pt-0">
            <PostImage
              imageUrl={imageUrl}
              title={title}
              className="relative h-48 overflow-hidden rounded-t-md"
            />
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="-mt-2">
              <p className="line-clamp-4 text-sm text-gray-700">
                {truncatedContent}
              </p>
            </CardContent>
            <PostMeta
              author={author}
              publishedAt={publishedAt}
              category={category}
            />
          </Card>
        </Link>
      )
  }
}
