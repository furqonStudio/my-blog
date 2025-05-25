import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

const post = {
  id: 1,
  title: 'Teknik Pomodoro untuk Produktivitas Maksimal',
  slug: 'teknik-pomodoro-produktivitas',
  image: 'https://picsum.photos/id/1011/600/400',
  publishedAt: '2025-05-24',
  content: `
    <p><strong>Teknik Pomodoro</strong> adalah metode manajemen waktu yang membantu Anda fokus dan produktif dengan membagi pekerjaan dalam interval waktu tertentu.</p>
    <h2>Bagaimana Cara Kerjanya?</h2>
    <ol>
      <li><strong>Tentukan Tugas:</strong> Pilih tugas yang akan Anda kerjakan.</li>
      <li><strong>Setel Timer:</strong> Atur timer Pomodoro selama 25 menit.</li>
      <li><strong>Fokus Penuh:</strong> Bekerja tanpa gangguan sampai timer berbunyi.</li>
      <li><strong>Istirahat Singkat:</strong> Setelah 25 menit, ambil istirahat 5 menit.</li>
      <li><strong>Istirahat Panjang:</strong> Setelah empat 'Pomodoro', ambil istirahat lebih panjang (15-30 menit).</li>
    </ol>
    <p>Teknik ini terbukti dapat mengurangi kelelahan mental, meningkatkan konsentrasi, dan membantu Anda menyelesaikan lebih banyak pekerjaan dalam waktu yang lebih singkat. Cobalah dan rasakan perbedaannya!</p>
  `,
  category: 'Produktivitas',
  author: 'Admin Blog',
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // if ((await params).slug !== post.slug) return notFound()

  return (
    <article className="prose-custom dark:prose-invert prose-headings:scroll-mt-20 mx-auto max-w-3xl px-4 py-12">
      <h1>{post.title}</h1>
      <p className="text-muted-foreground text-sm">
        Dipublikasikan pada {post.publishedAt} · oleh {post.author} ·{' '}
        {post.category}
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
