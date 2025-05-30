import { Prisma, PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

const postData: Prisma.PostCreateInput[] = [
  {
    title: 'Post Pertama',
    slug: 'post-pertama',
    image: 'https://picsum.photos/600/400?random=1',
    publishedAt: new Date().toISOString(),
    content: 'Ini adalah konten post pertama.',
    category: 'Teknologi',
    author: 'Furqon',
  },
  {
    title: 'Post Kedua',
    slug: 'post-kedua',
    image: 'https://picsum.photos/600/400?random=2',
    publishedAt: new Date().toISOString(),
    content: 'Konten post kedua di sini.',
    category: 'Pemrograman',
    author: 'Furqon',
  },
  {
    title: 'Post Ketiga',
    slug: 'post-ketiga',
    image: 'https://picsum.photos/600/400?random=3',
    publishedAt: new Date().toISOString(),
    content: 'Halo, ini adalah post ketiga.',
    category: 'Umum',
    author: 'Furqon',
  },
]

async function main() {
  console.log('🚀 Menjalankan seed...')

  for (const post of postData) {
    const created = await prisma.post.create({ data: post })
    console.log(`✅ Post "${created.title}" berhasil ditambahkan`)
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
