'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EditorClient from '@/features/post/components/EditorClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().refine(
    (val) => {
      const stripped = val.replace(/<[^>]+>/g, '').trim()
      return stripped.length > 0
    },
    {
      message: 'Konten wajib diisi',
    },
  ),
  category: z.string().optional(),
  publishedAt: z.string().optional(),
  author: z.string().optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, 'Gambar tidak valid')
    .optional(),
})

type PostFormValues = z.infer<typeof postSchema>

const AddPost = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      publishedAt: '',
      author: '',
      image: undefined,
    },
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: PostFormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      if (data.category) formData.append('category', data.category)
      if (data.publishedAt) formData.append('publishedAt', data.publishedAt)
      if (data.author) formData.append('author', data.author)
      if (data.image) formData.append('image', data.image)

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Gagal menyimpan post')

      const result = await res.json()
      console.log('✅ Post dibuat:', result)
      router.push('/posts')
    } catch (err) {
      console.error('❌ Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const contentValue = watch('content')
  console.log('📄 Content:', contentValue)

  return (
    <>
      <SiteHeader />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        {/* Form Utama */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Judul */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  placeholder="Judul artikel"
                  className={`px-3 py-5 text-3xl font-bold ${errors.title ? 'border-red-500 bg-red-500/5' : ''}`}
                  {...field}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Konten */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <>
                <EditorClient value={field.value} onChange={field.onChange} />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </>
            )}
          />

          <div className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Publikasikan'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-full flex-col gap-6 md:max-w-sm">
          {/* Kategori */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 rounded-md border p-4">
                <Label>Kategori</Label>
                <Input placeholder="Contoh: Teknologi" {...field} />
              </div>
            )}
          />

          {/* Tanggal Publikasi */}
          <Controller
            name="publishedAt"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 rounded-md border p-4">
                <Label>Tanggal Publikasi</Label>
                <Input type="date" {...field} />
              </div>
            )}
          />

          {/* Penulis */}
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 rounded-md border p-4">
                <Label>Penulis</Label>
                <Input placeholder="Nama penulis" {...field} />
              </div>
            )}
          />

          {/* Gambar */}
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="space-y-2 rounded-md border p-4">
                <Label>Feature Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    onChange(file || undefined)
                  }}
                />
                {typeof errors.image?.message === 'string' && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </form>
    </>
  )
}

export default AddPost
