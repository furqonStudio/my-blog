import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'Post Pertama',
        content: 'Ini adalah konten post pertama.',
      },
      {
        title: 'Post Kedua',
        content: 'Konten post kedua di sini.',
      },
      {
        title: 'Post Ketiga',
        content: 'Halo, ini adalah post ketiga.',
      },
    ],
  })

  console.log('✅ Seed selesai!')
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
