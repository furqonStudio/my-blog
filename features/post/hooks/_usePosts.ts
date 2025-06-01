import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Post, PostFormValues } from '../post.type'
import { draftSchema, postSchema } from '../post.schema'

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error('Gagal mengambil post')
  return (await res.json()) as Post[]
}

const addPost = async (data: PostFormValues): Promise<Post> => {
  // Pilih schema validasi dulu sebelum kirim
  const schema = data.status === 'DRAFT' ? draftSchema : postSchema

  // Validasi data sesuai schema (optional tapi sangat disarankan)
  schema.parse(data) // kalau error langsung throw

  const formData = new FormData()
  if (data.title) formData.append('title', data.title)
  if (data.content) formData.append('content', data.content)
  if (data.categoryId) formData.append('categoryId', data.categoryId)

  // Kirim imageUrl kalau ada dan valid
  if (data.imageUrl) {
    if (typeof data.imageUrl === 'string' || data.imageUrl instanceof File) {
      formData.append('imageUrl', data.imageUrl)
    }
  }

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
