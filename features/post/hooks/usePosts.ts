import { useMutation, useQuery } from '@tanstack/react-query'
import { Post } from '../post.type'

export type PostFormValues = {
  title: string
  content: string
  category?: string
  image?: File
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Gagal mengambil posts')
  return (await res.json()) as Post[]
}

const addPost = async (data: PostFormValues) => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  if (data.category) formData.append('category', data.category)
  if (data.image) formData.append('image', data.image)

  const res = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Gagal menyimpan post')

  return res.json()
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

export const useAddPost = () => {
  return useMutation(addPost)
}
