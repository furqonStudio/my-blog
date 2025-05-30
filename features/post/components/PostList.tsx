import React from 'react'
import { PostCard } from './PostCard'
import { Post } from '../post.type'

type PostListProps = {
  posts: Post[]
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  )
}
