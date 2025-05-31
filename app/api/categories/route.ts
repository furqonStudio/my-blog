import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// export async function GET() {
//   const categories = await prisma.category.findMany()
//   return NextResponse.json(categories)
// }

export async function POST(req: Request) {
  const body = await req.json()
  const { name } = body

  if (!name) {
    return NextResponse.json(
      { error: 'Nama kategori wajib diisi' },
      { status: 400 },
    )
  }

  const existing = await prisma.category.findUnique({ where: { name } })
  if (existing) {
    return NextResponse.json({ error: 'Kategori sudah ada' }, { status: 409 })
  }

  const category = await prisma.category.create({
    data: { name },
  })

  return NextResponse.json(category, { status: 201 })
}
