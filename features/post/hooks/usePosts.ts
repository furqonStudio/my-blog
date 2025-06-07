import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post } from '../post.type'

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Gagal mengambil post')
  return (await res.json()) as Post[]
}

const fetchPostById = async (id: string): Promise<Post> => {
  const res = await fetch(`/api/posts/${id}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Gagal mengambil detail post')
  }

  return await res.json()
}

const createPost = async (formData: FormData): Promise<Post> => {
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

const deletePost = async (id: string): Promise<Post> => {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Gagal menghapus post')
  }

  return await res.json()
}

const updatePost = async ({
  id,
  formData,
}: {
  id: string
  formData: FormData
}): Promise<Post> => {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Gagal mengupdate post')
  }

  return await res.json()
}

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

export const usePost = (id: string) => {
  return useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
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

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
