import prisma from '@/lib/prisma'

export const generateSlug: {
  (title: string): string
} = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export async function generateUniqueSlug(baseTitle: string): Promise<string> {
  const baseSlug = generateSlug(baseTitle)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!existing) break

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
