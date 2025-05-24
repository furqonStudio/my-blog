import { PostList } from '@/features/post/components/PostList'

export default function Home() {
  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Blog
      </h1>
      <PostList />
    </div>
  )
}
