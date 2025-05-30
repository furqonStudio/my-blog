import prisma from '@/lib/prisma'
import { formatDate } from '@/utils/formatDate'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) {
    notFound()
  }

  return (
    <article className="prose-custom dark:prose-invert prose-headings:scroll-mt-20 mx-auto max-w-3xl px-4 py-12">
      <h1>{post.title}</h1>
      <p className="text-muted-foreground text-sm">
        Dipublikasikan pada {formatDate(post.publishedAt)} · oleh {post.author}{' '}
        · {post.category}
      </p>
      <div className="my-6">
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={500}
          className="w-full rounded-md object-cover"
        />
      </div>
      <section
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
