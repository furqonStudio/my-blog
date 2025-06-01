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
  formData.append('categoryId', data.categoryId)
  formData.append('imageUrl', data.imageUrl)
  formData.append('status', data.status)

  const res = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.error || err?.message || 'Gagal membuat post')
  }

  return (await res.json()) as Post
}

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

export const useAddPost = () => {
  const queryClient = useQueryClient()
  return useMutation<Post, Error, PostFormValues>({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
