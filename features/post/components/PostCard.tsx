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

function stripHtmlTags(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

type Variant = 'besar' | 'menyamping' | 'biasa'

type Props = {
  post: PublishedPost
  variant?: Variant
}

export const PostCard = ({ post, variant = 'biasa' }: Props) => {
  const { title, slug, imageUrl, publishedAt, content, category, author } = post
  const plainTextContent = stripHtmlTags(content)
  const truncatedContent =
    plainTextContent.length > 150
      ? plainTextContent.substring(0, 150) + '...'
      : plainTextContent

  if (variant === 'besar') {
    return (
      <Link href={`/post/${slug}`}>
        <Card className="w-full pt-0">
          <div className="relative h-64 overflow-hidden rounded-t-md">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
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
          <CardFooter className="flex flex-col items-start gap-1 text-xs text-gray-500">
            <p>
              Oleh {author || 'Anonim'} • {formatDate(publishedAt)}
            </p>
            {category && <p>Kategori: {category}</p>}
          </CardFooter>
        </Card>
      </Link>
    )
  }

  if (variant === 'menyamping') {
    return (
      <Link href={`/post/${slug}`}>
        <Card className="flex w-full flex-row gap-3 overflow-hidden p-0">
          <div className="relative aspect-[4/3] w-1/3">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          </div>
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
  }

  return (
    <Link href={`/post/${slug}`}>
      <Card className="flex h-[440px] w-full flex-col pt-0">
        <div className="relative h-48 overflow-hidden rounded-t-md">
          <Image src={imageUrl} alt={title} className="object-cover" fill />
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="-mt-2">
          <p className="line-clamp-4 text-sm text-gray-700">
            {truncatedContent}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 text-xs text-gray-500">
          <p>
            Oleh {author || 'Anonim'} • {formatDate(publishedAt)}
          </p>
          {category && <span>Kategori: {category}</span>}
        </CardFooter>
      </Card>
    </Link>
  )
}
