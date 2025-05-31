'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import EditorClient from '@/features/post/components/EditorClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, Plus, Trash, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
} from '@/features/categories/hooks/useCategories'
import { useAddPost } from '@/features/post/hooks/usePosts'

const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z
    .string()
    .refine((val) => val.replace(/<[^>]+>/g, '').trim().length > 0, {
      message: 'Konten wajib diisi',
    }),
  category: z.string().optional(),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, 'Gambar tidak valid')
    .optional(),
})

type PostFormValues = z.infer<typeof postSchema>

const AddPost = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      image: undefined,
    },
  })

  const [newCategory, setNewCategory] = useState('')
  const [open, setOpen] = useState(false)
  const { data: categories = [], isLoading, isError } = useCategories()
  const addCategory = useAddCategory()
  const deleteCategory = useDeleteCategory()
  const addPost = useAddPost()

  const onSubmit = (data: PostFormValues) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    addPost.mutate(data, {
      onSuccess: () => {
        toast.success('Post berhasil dipublikasikan!')
        router.push('/posts')
      },
      onError: () => {
        toast.error('Gagal menyimpan post.')
      },
    })
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    addCategory.mutate(newCategory, {
      onSuccess: () => {
        toast.success('Kategori berhasil ditambahkan.')
        setNewCategory('')
      },
      onError: () => {
        toast.error('Gagal menambahkan kategori.')
      },
    })
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        toast.success('Kategori berhasil dihapus.')
      },
      onError: () => {
        toast.error('Gagal menghapus kategori.')
      },
    })
  }

  return (
    <>
      <SiteHeader />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        {/* Kolom kiri */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Judul */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  placeholder="Judul artikel"
                  className={`px-3 py-5 text-3xl font-bold ${errors.title ? 'border-red-500 bg-red-500/5' : ''}`}
                  {...field}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Konten */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <>
                <EditorClient value={field.value} onChange={field.onChange} />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </>
            )}
          />

          <div className="mt-4">
            <Button type="submit" disabled={addPost.isPending}>
              {addPost.isPending ? 'Menyimpan...' : 'Publikasikan'}
            </Button>
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="space-y-4">
          {/* Kategori */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="space-y-2 rounded-md border p-4">
                <Label>Kategori</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {field.value
                        ? categories.find((cat) => cat.id === field.value)
                            ?.name || 'Pilih kategori'
                        : 'Pilih kategori'}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari kategori..." />
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.id}
                            className="flex items-center justify-between"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => {
                                field.onChange(cat.id)
                                setOpen(false)
                              }}
                            >
                              {cat.name}
                            </div>
                            <div className="flex items-center gap-2">
                              {field.value === cat.id && (
                                <Check className="text-primary h-4 w-4" />
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCategory(cat.id)
                                }}
                              >
                                <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
                              </button>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Tambah kategori */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Kategori baru"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCategory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          />

          {/* Gambar */}
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => {
              const previewUrl =
                value instanceof File ? URL.createObjectURL(value) : null

              return (
                <div className="space-y-2 rounded-md border p-4">
                  <Label>Feature Image</Label>
                  <label
                    htmlFor="image-upload"
                    className="group relative flex aspect-video w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition hover:border-gray-400"
                  >
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500">
                        <Upload className="mb-2 h-8 w-8" />
                        <span className="text-sm">
                          Klik untuk upload gambar
                        </span>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full opacity-0"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        onChange(file || undefined)
                      }}
                    />
                  </label>

                  {typeof errors.image?.message === 'string' && (
                    <p className="text-sm text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              )
            }}
          />
        </div>
      </form>
    </>
  )
}

export default AddPost
