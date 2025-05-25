'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'

const AddPost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [publishedAt, setPublishedAt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost = {
      title,
      content,
      category,
      publishedAt,
    }

    console.log('Artikel baru:', newPost)
    // TODO: kirim ke backend
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-6 px-6 py-6 md:flex-row">
        {/* Kolom Konten */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
          <Input
            placeholder="Tambahkan judul artikel"
            className="px-3 py-5 text-3xl font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Tulis konten artikel di sini..."
            className="min-h-[300px] text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-4">
            <Button type="submit">Publikasikan</Button>
          </div>
        </form>

        {/* Sidebar Kanan */}
        <div className="flex w-full flex-col gap-6 md:max-w-sm">
          <div className="space-y-2 rounded-md border p-4">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              placeholder="Contoh: Produktivitas"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <Label htmlFor="publishedAt">Tanggal Publikasi</Label>
            <Input
              id="publishedAt"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AddPost
