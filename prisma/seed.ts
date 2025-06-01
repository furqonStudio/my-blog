import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

const postData = [
  {
    title: 'Post Pertama',
    slug: 'post-pertama',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    publishedAt: new Date(),
    content: 'Ini adalah konten post pertama.',
    categoryName: 'Teknologi',
    author: 'Furqon',
    status: 'PUBLISHED',
  },
  {
    title: 'Post Kedua',
    slug: 'post-kedua',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    publishedAt: new Date(),
    content: 'Konten post kedua di sini.',
    categoryName: 'Pemrograman',
    author: 'Furqon',
    status: 'DRAFT',
  },
  {
    title: 'Post Ketiga',
    slug: 'post-ketiga',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    publishedAt: new Date(),
    content: 'Halo, ini adalah post ketiga.',
    categoryName: 'Umum',
    author: 'Furqon',
    status: 'PUBLISHED',
  },
] as const

async function main() {
  console.log('🚀 Menjalankan seed...')

  for (const post of postData) {
    const category = await prisma.category.upsert({
      where: { name: post.categoryName },
      update: {},
      create: { name: post.categoryName },
    })

    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        content: post.content,
        author: post.author,
        status: post.status,
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
