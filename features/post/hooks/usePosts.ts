import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post, PostFormValues } from '../post.type'

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Gagal mengambil post')
  return (await res.json()) as Post[]
}

const addPost = async (data: PostFormValues): Promise<Post> => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  if (data.categoryId) formData.append('categoryId', data.categoryId)
  if (data.image) formData.append('image', data.image)

  const res = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || 'Gagal membuat post')
  }

  return (await res.json()) as Post
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

export const useAddPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
