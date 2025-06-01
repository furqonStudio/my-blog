import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link' // Import Link dari Next.js untuk navigasi
import { Post } from '@/features/post/post.type' // Import tipe Post
import { formatDate } from '@/utils/formatDate'

// Fungsi helper untuk menghapus tag HTML dari string konten
function stripHtmlTags(html: string): string {
  // Hanya jalankan di lingkungan browser
  if (typeof window === 'undefined') {
    // Pada server-side rendering, kita bisa mengembalikan string asli
    // atau gunakan pustaka nodejs seperti 'striptags'
    return html // Atau implementasi strip tags yang lebih robust untuk SSR
  }
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  const { title, slug, imageUrl, publishedAt, content, category, author } = post

  const plainTextContent = stripHtmlTags(content)
  const truncatedContent =
    plainTextContent.length > 150
      ? plainTextContent.substring(0, 150) + '...'
      : plainTextContent

  return (
    <Link href={`/post/${slug}`}>
      <Card className="w-[350px] pt-0">
        <div className="relative h-48 overflow-hidden rounded-t-md">
          <Image
            src={imageUrl}
            alt={`Gambar Cover untuk ${title}`}
            className="aspect-video object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimasi gambar untuk responsif
            style={{ objectFit: 'cover' }}
          />
        </div>
        <CardHeader>
          <CardTitle>
            <h3>{title}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="-mt-2">
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: truncatedContent }}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-xs text-gray-500">
            Oleh {author || 'Anonim'} &bull; {formatDate(publishedAt)}
          </p>
          {category && (
            <span className="text-xs text-gray-400">
              Kategori: {category.name}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
