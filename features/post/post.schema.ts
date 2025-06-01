import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z
    .string()
    .refine((val) => val.replace(/<[^>]+>/g, '').trim().length > 0, {
      message: 'Konten wajib diisi',
    }),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  image: z.instanceof(File, {
    message: 'Gambar tidak valid atau belum dipilih',
  }),
})

export const draftSchema = z.object({
  title: z.string().optional(),
  content: z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/<[^>]+>/g, '').trim().length > 0, {
      message: 'Konten tidak boleh hanya tag kosong',
    }),
  categoryId: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, 'Gambar tidak valid'),
})
