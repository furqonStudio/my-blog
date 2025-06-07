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
import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
} from '@/features/categories/hooks/useCategories'
import EditorClient from '@/features/post/components/EditorClient'
import { createPostSchema } from '@/features/post/post.schema'
import { isEditorContentEmpty } from '@/utils/editor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronDown, Plus, Trash, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type CreatePostSchema = z.infer<typeof createPostSchema>

const AddPost = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  })

  const title = watch('title')
  const content = watch('content')
  const category = watch('categoryId')
  const imageFile = watch('image')

  const isContentEmpty = isEditorContentEmpty(content)

  const isAllEmpty = useMemo(() => {
    const isTitleEmpty = !title || title.trim() === ''
    const isCategoryEmpty = !category
    const isImageEmpty = !(imageFile instanceof File)

    return isTitleEmpty && isContentEmpty && isCategoryEmpty && isImageEmpty
  }, [title, isContentEmpty, category, imageFile])

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(undefined)
    }
  }, [imageFile])

  const [newCategory, setNewCategory] = useState('')
  const [open, setOpen] = useState(false)
  const { data: categories = [] } = useCategories()
  const addCategory = useAddCategory()
  const deleteCategory = useDeleteCategory()

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

  const createPost = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal menyimpan post')
      }

      return res.json()
    },
    onSuccess: (data) => {
      toast.success(
        `Berhasil disimpan sebagai ${data.status === 'DRAFT' ? 'draf' : 'publikasi'}`,
      )
      router.back()
    },
    onError: (err) => {
      console.log('🚀 ~ AddPost ~ err:', err.message)

      toast.error(err.message || 'Gagal menyimpan')
    },
  })

  const onSubmit = (data: CreatePostSchema) => {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.content) formData.append('content', data.content)
    if (data.categoryId) formData.append('categoryId', data.categoryId)
    formData.append('status', data.status)
    if (data.image instanceof File) formData.append('image', data.image)

    const test: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of formData.entries()) {
      test[key] = value
    }
    console.log('Form Data:', test)

    createPost.mutate(formData)
  }

  return (
    <>
      <SiteHeader />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        <div className="flex flex-1 flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  placeholder="Judul artikel"
                  className={`px-3 py-5 text-3xl font-bold ${
                    errors.title ? 'border-red-500 bg-red-500/5' : ''
                  }`}
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

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <>
                <EditorClient
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </>
            )}
          />

          <div className="mt-4 flex gap-2">
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                disabled={createPost.isPending || isAllEmpty}
                onClick={() => {
                  setValue('status', 'PUBLISHED')
                  handleSubmit(onSubmit)()
                }}
              >
                {createPost.isPending ? 'Menyimpan...' : 'Publikasikan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={createPost.isPending || isAllEmpty}
                onClick={() => {
                  setValue('status', 'DRAFT')
                  handleSubmit(onSubmit)()
                }}
              >
                {createPost.isPending ? 'Menyimpan...' : 'Simpan sebagai Draf'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Controller
            name="categoryId"
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
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field: { onChange } }) => (
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
                      <span className="text-sm">Klik untuk upload gambar</span>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 h-full w-full opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      onChange(file)
                    }}
                  />
                </label>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.image.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </form>
    </>
  )
}

export default AddPost
