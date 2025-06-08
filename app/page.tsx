import { PostCard } from '@/features/post/components/PostCard'
import { getPublishedPosts } from '@/features/post/post.controller'

export default async function Home() {
  const publishedPosts = await getPublishedPosts()

  if (publishedPosts.length === 0) {
    return (
      <div className="py-20 text-center text-xl">
        Belum ada post yang tersedia.
      </div>
    )
  }

  const [featuredPost, ...otherPosts] = publishedPosts

  return (
    <div>
      <h1 className="scroll-m-20 py-8 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Blog
      </h1>

      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-row gap-6">
          <div className="w-7/12">
            <PostCard post={featuredPost} variant="besar" />
          </div>

          <div className="flex w-5/12 flex-col gap-4">
            {otherPosts.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} variant="menyamping" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
