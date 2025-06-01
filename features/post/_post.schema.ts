import { PostStatus } from '@/app/generated/prisma'
import { z } from 'zod'

const imageFileValidator = z
  .custom<File | undefined>()
  .refine(
    (file) => file !== undefined && file !== null && file instanceof File,
    'Gambar tidak valid atau belum dipilih',
  )
  .refine(
    (file) => file && file.type.startsWith('image/'),
    'File harus berupa gambar',
  )
  .refine(
    (file) => file && file.size <= 2 * 1024 * 1024,
    'Ukuran gambar maksimal 2MB',
  )

const imageFileOrUrlValidator = z.union([
  imageFileValidator,
  z.string().url(),
  z.undefined(),
])

export const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]+>/g, '').trim().length > 0,
      'Konten wajib diisi',
    ),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  imageUrl: imageFileOrUrlValidator,
  status: z.nativeEnum(PostStatus, {
    errorMap: () => ({ message: 'Status tidak valid' }),
  }),
})

export const draftSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.union([
    imageFileValidator.optional(),
    z.string().url().optional(),
    z.undefined(),
  ]),
  status: z.nativeEnum(PostStatus).optional().default(PostStatus.DRAFT),
})
