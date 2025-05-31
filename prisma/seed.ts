import { PrismaClient } from '@/app/generated/prisma'
import { Post } from '@/features/post/post.type'

const prisma = new PrismaClient()

const postData: Post[] = [
  {
    id: 1,
    title: 'Post Pertama',
    slug: 'post-pertama',
    image: 'https://picsum.photos/600/400?random=1',
    publishedAt: new Date(),
    content: 'Ini adalah konten post pertama.',
    category: 'Teknologi',
    author: 'Furqon',
  },
  {
    id: 2,
    title: 'Post Kedua',
    slug: 'post-kedua',
    image: 'https://picsum.photos/600/400?random=2',
    publishedAt: new Date(),
    content: 'Konten post kedua di sini.',
    category: 'Pemrograman',
    author: 'Furqon',
  },
  {
    id: 3,
    title: 'Post Ketiga',
    slug: 'post-ketiga',
    image: 'https://picsum.photos/600/400?random=3',
    publishedAt: new Date(),
    content: 'Halo, ini adalah post ketiga.',
    category: 'Umum',
    author: 'Furqon',
  },
]

async function main() {
  console.log('🚀 Menjalankan seed...')

  for (const post of postData) {
    // Pastikan kategori ada
    const category = await prisma.category.upsert({
      where: { name: post.category ?? 'Tanpa Kategori' },
      update: {},
      create: { name: post.category ?? 'Tanpa Kategori' },
    })

    // Transformasi ke bentuk PostCreateInput
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        image: post.image,
        publishedAt: post.publishedAt,
        content: post.content,
        author: post.author,
        category: {
          connect: { id: category.id },
        },
      },
    })

    console.log(`✅ Post "${post.title}" berhasil ditambahkan`)
  }

  console.log('🎉 Seed selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
