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

// Definisikan props untuk PostCard
interface PostCardProps {
  post: Post // Menerima seluruh objek post
}

export const PostCard = ({ post }: PostCardProps) => {
  const { title, slug, image, publishedAt, content, category, author } = post
  console.log('🚀 ~ PostCard ~ publishedAt:', publishedAt)

  // Format tanggal agar lebih mudah dibaca
  const date = new Date(publishedAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Ambil teks plain dari HTML dan potong untuk ringkasan di CardContent
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
            src={image} // Menggunakan URL gambar dari data post
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
            Oleh {author || 'Anonim'} &bull; {date}
          </p>
          {category && (
            <span className="text-xs text-gray-400">Kategori: {category}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
