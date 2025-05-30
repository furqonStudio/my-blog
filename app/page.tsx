import { PostList } from '@/features/post/components/PostList'
import prisma from '@/lib/prisma'

export default async function Home() {
  const posts = await prisma.post.findMany()

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Blog
      </h1>
      <PostList posts={posts} />
    </div>
  )
}
