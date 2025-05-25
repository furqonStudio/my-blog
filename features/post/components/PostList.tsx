import React from 'react'
import { posts } from '@/data'
import { PostCard } from './PostCard'

export const PostList = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  )
}
