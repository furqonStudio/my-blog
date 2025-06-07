import { isEditorContentEmpty } from '@/utils/editor'
import { z } from 'zod'

export const createPostSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    categoryId: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
    image: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    const isContentEmpty = isEditorContentEmpty(data.content)

    if (data.status === 'PUBLISHED') {
      if (!data.title?.trim()) {
        ctx.addIssue({
          path: ['title'],
          code: z.ZodIssueCode.custom,
          message: 'Judul wajib diisi saat publish.',
        })
      }
      if (isContentEmpty) {
        ctx.addIssue({
          path: ['content'],
          code: z.ZodIssueCode.custom,
          message: 'Konten wajib diisi saat publish.',
        })
      }
      if (!data.categoryId?.trim()) {
        ctx.addIssue({
          path: ['categoryId'],
          code: z.ZodIssueCode.custom,
          message: 'Category ID wajib diisi saat publish.',
        })
      }
      if (!data.image) {
        ctx.addIssue({
          path: ['image'],
          code: z.ZodIssueCode.custom,
          message: 'Image wajib diupload saat publish.',
        })
      }
    }

    if (data.status === 'DRAFT') {
      const isAllEmpty =
        !data.title?.trim() &&
        isContentEmpty &&
        !data.categoryId?.trim() &&
        !data.image

      if (isAllEmpty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tidak bisa menyimpan draft kosong semua.',
        })
      }
    }
  })
