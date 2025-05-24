import React from 'react'
import { PostCard } from './PostCard'
import { posts } from '@/data'

export const PostList = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  )
}
