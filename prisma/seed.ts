import { PrismaClient } from '@/app/generated/prisma'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const categories = [
  'Teknologi',
  'Pemrograman',
  'Umum',
  'Seni',
  'Bisnis',
  'Kesehatan',
]

async function main() {
  console.log('🚀 Menjalankan seed...')

  // Pastikan semua kategori dibuat
  const categoryMap: Record<string, { id: string; name: string }> = {}

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    categoryMap[name] = category
  }

  // Generate 100 post
  for (let i = 1; i <= 100; i++) {
    const categoryName = faker.helpers.arrayElement(categories)
    const category = categoryMap[categoryName]

    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        slug: `post-${i}-${faker.lorem.slug()}`,
        imageUrl: `https://picsum.photos/600/400?random=${i}`,
        publishedAt: faker.date.past(),
        content: faker.lorem.paragraphs(3),
        author: faker.person.fullName(),
        status: faker.helpers.arrayElement(['DRAFT', 'PUBLISHED']),
        category: {
          connect: { id: category.id },
        },
      },
    })

    console.log(`✅ Post ${i} berhasil dibuat.`)
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
