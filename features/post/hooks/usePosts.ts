import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post } from '../post.type'

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Gagal mengambil post')
  return (await res.json()) as Post[]
}

export const createPost = async (formData: FormData): Promise<Post> => {
  const res = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Gagal menyimpan post')
  }

  return await res.json()
}

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
