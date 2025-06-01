import { PostStatus } from '@/app/generated/prisma'
import { z } from 'zod'

const imageFileValidator = z
  .custom<File>()
  .refine(
    (file) => file instanceof File,
    'Gambar tidak valid atau belum dipilih',
  )
  .refine((file) => file.type.startsWith('image/'), 'File harus berupa gambar')
  .refine((file) => file.size <= 2 * 1024 * 1024, 'Ukuran gambar maksimal 2MB')

export const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]+>/g, '').trim().length > 0,
      'Konten wajib diisi',
    ),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  imageUrl: imageFileValidator,
  status: z.nativeEnum(PostStatus, {
    errorMap: () => ({ message: 'Status tidak valid' }),
  }),
})

export const draftSchema = z.object({
  title: z.string().default(() => `Draft Post ${Date.now()}`),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.union([
    z.string().url().optional(),
    z.instanceof(File).optional(),
    z.undefined(),
  ]),
  status: z.nativeEnum(PostStatus).optional(),
})
