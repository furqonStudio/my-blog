import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'

export const PostCard = () => {
  return (
    <Card className="w-[350px] pt-0">
      <div className="relative h-48 overflow-hidden rounded-t-md">
        <Image
          src={'https://picsum.photos/200'}
          alt="Gambar Cover Blog"
          className="aspect-video object-cover" // Menjaga aspek rasio dan mengisi ruang
          fill // Mengisi seluruh area div
          style={{ objectFit: 'cover' }} // Memastikan gambar tidak terdistorsi
        />
      </div>
      <CardHeader className="-mb-4">
        <CardTitle>
          <h3>Judul Postingan Blog Saya</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="-mb-4">
        <p>
          Konten utama dari postingan blog akan ada di sini. Anda bisa
          menambahkan paragraf, gambar, atau elemen lainnya.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="mt-2 text-sm text-gray-500">
          Diterbitkan pada 24 Mei 2025
        </p>
      </CardFooter>
    </Card>
  )
}
