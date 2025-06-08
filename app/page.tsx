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
      <div className="mx-auto max-w-5xl space-y-10 px-4">
        <div className="flex flex-row gap-6">
          <div className="w-7/12">
            <PostCard post={featuredPost} variant="large" />
          </div>

          <div className="flex w-5/12 flex-col gap-4">
            {otherPosts.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} variant="small" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Posts</h2>
          <div className="grid grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
