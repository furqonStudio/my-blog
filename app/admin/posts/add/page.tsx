'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EditorClient from '@/features/post/components/EditorClient'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'

const AddPost = () => {
  console.log('RENDERD')
  const [form, setForm] = useState({
    title: '',
    category: '',
    publishedAt: '',
    author: '',
    image: null as File | null,
  })
  const [contentState, setContentState] = useState('')

  const setContent = useCallback((val: string) => {
    setContentState(val)
  }, [])

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleChange = (field: string, value: string | File | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('content', contentState)
      formData.append('category', form.category)
      formData.append('publishedAt', form.publishedAt)
      formData.append('author', form.author)
      if (form.image) formData.append('image', form.image)

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
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <EditorClient value={contentState} onChange={setContent} />

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
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Tanggal Publikasi</Label>
            <Input
              type="date"
              value={form.publishedAt}
              onChange={(e) => handleChange('publishedAt', e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Penulis</Label>
            <Input
              placeholder="Nama penulis"
              value={form.author}
              onChange={(e) => handleChange('author', e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label>Feature Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                handleChange('image', file)
              }}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default AddPost
