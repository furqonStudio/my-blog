'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import EditorClient from '@/features/post/components/EditorClient'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AddPost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [author, setAuthor] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('category', category)
      formData.append('publishedAt', publishedAt)
      formData.append('author', author)
      if (image) formData.append('image', image)

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Gagal menyimpan post')

      const data = await res.json()
      console.log('✅ Post dibuat:', data)
      router.push('/posts')
    } catch (err) {
      console.error('❌ Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        {/* Form Utama */}
        <div className="flex flex-1 flex-col gap-4">
          <Input
            placeholder="Judul artikel"
            className="px-3 py-5 text-3xl font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            placeholder="Tulis konten artikel di sini..."
            className="min-h-[300px] text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <EditorClient value={content} onChange={setContent} />

          <div className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Publikasikan'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-full flex-col gap-6 md:max-w-sm">
          <div className="space-y-2 rounded-md border p-4">
            <Label>Kategori</Label>
            <Input
              placeholder="Contoh: Teknologi"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Tanggal Publikasi</Label>
            <Input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Penulis</Label>
            <Input
              placeholder="Nama penulis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Feature Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0])
                }
              }}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default AddPost
