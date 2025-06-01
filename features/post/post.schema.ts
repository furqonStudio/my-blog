import { z } from 'zod'

export const createPostSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    imageUrl: z.string().url().optional(),
    categoryId: z.string().cuid().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
  })
  .superRefine((data, ctx) => {
    const { title, content, imageUrl, categoryId, status } = data

    // Semua field kosong checker
    const allEmpty =
      (!title || title.trim() === '') &&
      (!content || content.trim() === '') &&
      (!imageUrl || imageUrl.trim() === '') &&
      (!categoryId || categoryId.trim() === '')

    if (status === 'DRAFT') {
      if (allEmpty) {
        ctx.addIssue({
          code: 'custom',
          message: 'Minimal satu field harus diisi untuk draft',
          path: [], // error global
        })
      }
    }

    if (status === 'PUBLISHED') {
      // Semua wajib
      if (!title || title.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['title'],
          message: 'Judul wajib diisi saat publish',
        })
      }
      if (!content || content.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['content'],
          message: 'Konten wajib diisi saat publish',
        })
      }
      if (!imageUrl || imageUrl.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['imageUrl'],
          message: 'Image URL wajib diisi saat publish',
        })
      }
      if (!categoryId || categoryId.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['categoryId'],
          message: 'Kategori wajib diisi saat publish',
        })
      }
    }
  })
