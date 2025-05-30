import { Prisma, PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient()

const postData: Prisma.PostCreateInput[] = [
  { title: 'Post Pertama', content: 'Ini adalah konten post pertama.' },
  { title: 'Post Kedua', content: 'Konten post kedua di sini.' },
  { title: 'Post Ketiga', content: 'Halo, ini adalah post ketiga.' },
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
