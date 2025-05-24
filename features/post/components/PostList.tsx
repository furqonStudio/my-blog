import React from 'react'
import { PostCard } from './PostCard'

export const PostList = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {Array.from({ length: 6 }).map((item, index) => (
        <PostCard key={index} />
      ))}
    </div>
  )
}
