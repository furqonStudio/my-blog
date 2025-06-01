'use client'

import React, { useState } from 'react'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Validasi frontend minimal berdasarkan aturan kamu
  function validate() {
    if (status === 'PUBLISHED') {
      if (!title.trim()) return 'Judul wajib diisi saat publish.'
      if (!content.trim()) return 'Konten wajib diisi saat publish.'
      if (!categoryId.trim()) return 'Category ID wajib diisi saat publish.'
      if (!imageFile) return 'Image wajib diupload saat publish.'
    } else if (status === 'DRAFT') {
      if (
        !title.trim() &&
        !content.trim() &&
        !categoryId.trim() &&
        !imageFile
      ) {
        return 'Tidak bisa menyimpan draft kosong semua.'
      }
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const error = validate()
    if (error) {
      setMessage(error)
      return
    }

    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('categoryId', categoryId)
    formData.append('status', status)
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        console.log('🚀 ~ handleSubmit ~ err:', err)
        setMessage('Gagal: ' + (err.error || 'Unknown error'))
        setLoading(false)
        return
      }

      const data = await res.json()
      setMessage(`Post berhasil dibuat dengan ID: ${data.id}`)

      // Reset form
      setTitle('')
      setContent('')
      setCategoryId('')
      setStatus('DRAFT')
      setImageFile(null)
    } catch {
      setMessage('Terjadi kesalahan saat submit.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: 8,
      }}
    >
      <h1>Buat Post Baru</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
            placeholder="Judul post"
          />
        </label>

        <label>
          Content:
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
            placeholder="Isi konten post"
          />
        </label>

        <label>
          Category ID:
          <br />
          <input
            type="text"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Isi id kategori jika ada"
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
        </label>

        <label>
          Status:
          <br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
        </label>

        <label>
          Image:
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            style={{ marginBottom: 10 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Menyimpan...' : 'Submit'}
        </button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  )
}
