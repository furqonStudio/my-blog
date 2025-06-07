'use client'

import { SiteHeader } from '@/components/site-header'
import { PostForm } from '@/features/post/components/organisms/PostForm'
import { usePost, useUpdatePost } from '@/features/post/hooks/usePosts'
import { createPostSchema } from '@/features/post/post.schema'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type CreatePostSchema = z.infer<typeof createPostSchema>

const EditPost = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data: post, isLoading } = usePost(id)
  const updatePost = useUpdatePost()

  const [defaultValues, setDefaultValues] = useState<Partial<CreatePostSchema>>(
    {},
  )

  useEffect(() => {
    if (post) {
      setDefaultValues({
        title: post.title,
        content: post.content,
        status: post.status,
        categoryId: String(post.categoryId),
        image: post.imageUrl,
      })
    }
  }, [post])

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

    updatePost.mutate(
      { id, formData },
      {
        onSuccess: () => {
          toast.success('Post berhasil diperbarui')
          router.back()
        },
        onError: (err) => {
          console.log('🚀 ~ onSubmit ~ err:', err)
          toast.error(err.message || 'Gagal mengupdate post')
        },
      },
    )
  }

  return (
    <>
      <SiteHeader />
      <PostForm
        onSubmit={onSubmit}
        isSubmitting={updatePost.isPending}
        defaultValues={defaultValues}
      />
    </>
  )
}

export default EditPost
