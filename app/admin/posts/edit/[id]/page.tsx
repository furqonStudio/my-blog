'use client'

import { SiteHeader } from '@/components/site-header'
import { PostForm } from '@/features/post/components/organisms/PostForm'
import { useCreatePost } from '@/features/post/hooks/usePosts'
import { createPostSchema } from '@/features/post/post.schema'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

type CreatePostSchema = z.infer<typeof createPostSchema>

const EditPost = () => {
  const router = useRouter()
  const createPost = useCreatePost()

  const onSubmit = (data: CreatePostSchema) => {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.content) formData.append('content', data.content)
    if (data.categoryId) formData.append('categoryId', data.categoryId)
    formData.append('status', data.status)
    if (data.image instanceof File) formData.append('image', data.image)

    const test: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of formData.entries()) {
      test[key] = value
    }
    console.log('Form Data:', test)

    createPost.mutate(formData, {
      onSuccess: (data) => {
        toast.success(
          `Berhasil disimpan sebagai ${data.status === 'DRAFT' ? 'draf' : 'publikasi'}`,
        )
        router.back()
      },
      onError: (err) => {
        toast.error(err.message || 'Gagal menyimpan')
      },
    })
  }

  return (
    <>
      <SiteHeader />
      <PostForm onSubmit={onSubmit} isSubmitting={createPost.isPending} />
    </>
  )
}

export default AddPost
