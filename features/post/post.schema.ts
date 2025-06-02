import { z } from 'zod'

export const createPostSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    categoryId: z.string().cuid().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
    imageFile: z.any().optional(), // tambahkan ini untuk validasi file upload
  })
  .superRefine((data, ctx) => {
    const { title, content, imageFile, categoryId, status } = data

    const allEmpty =
      (!title || title.trim() === '') &&
      (!content || content.trim() === '') &&
      !imageFile &&
      (!categoryId || categoryId.trim() === '')

    if (status === 'DRAFT') {
      if (allEmpty) {
        ctx.addIssue({
          code: 'custom',
          message: 'Minimal satu field harus diisi untuk draft',
          path: [],
        })
      }
    }

    if (status === 'PUBLISHED') {
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
      if (!imageFile) {
        ctx.addIssue({
          code: 'custom',
          path: ['imageFile'],
          message: 'Image wajib diupload saat publish',
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
