import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PostCard } from '@/features/post/components/PostCard'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
  })

  if (!posts || posts.length === 0) {
    return <p className="py-10 text-center">Belum ada postingan.</p>
  }

  const [mainPost, ...sidePosts] = posts

  return (
    <div>
      <h1 className="scroll-m-20 py-8 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Blog
      </h1>

      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-row gap-6">
          <div className="w-7/12">
            <PostCard post={posts[0]} variant="besar" />

            {/* <PostCard post={posts[1]} variant="biasa" /> */}
          </div>

          {/* Side posts */}
          <div className="flex w-5/12 flex-col gap-6">
            {sidePosts.slice(0, 3).map((post) => (
              <PostCard post={post} variant="menyamping" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
