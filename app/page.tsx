'use client'
import { PostList } from '@/features/post/components/PostList'
import { useEffect, useState } from 'react'

export default function Home() {
  type Post = {
    id: number
    title: string
    content: string
    createdAt: string
  }

  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts)
  }, [])

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        My Blog
      </h1>
      <PostList />
    </div>
  )
}
