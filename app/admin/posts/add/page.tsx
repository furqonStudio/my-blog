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
import { useAddPost } from '@/features/post/hooks/usePosts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().refine(
    (val) => {
      const stripped = val.replace(/<[^>]+>/g, '').trim()
      return stripped.length > 0
    },
    { message: 'Konten wajib diisi' },
  ),
  category: z.string().optional(),
  image: z
    .any()
    .refine((file) => file instanceof File, 'Gambar tidak valid')
    .optional(),
})

type PostFormValues = z.infer<typeof postSchema>

const AddPost = () => {
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

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories()
  const addCategoryMutation = useAddCategory()
  const deleteCategoryMutation = useDeleteCategory()
  const addPostMutation = useAddPost()
  const router = useRouter()

  const [newCategory, setNewCategory] = useState('')
  const [open, setOpen] = useState(false)

  const handleAddCategory = () => {
    const trimmed = newCategory.trim()
    if (!trimmed) return

    if (categories.some((c) => c.name === trimmed)) return

    addCategoryMutation.mutate(trimmed, {
      onSuccess: () => {
        setNewCategory('')
      },
      onError: (error) => {
        console.error('❌ Gagal tambah kategori:', error)
      },
    })
  }

  const handleDeleteCategory = (id: string) => {
    if (!window.confirm('Yakin ingin menghapus kategori ?')) return

    deleteCategoryMutation.mutate(id, {
      onError: (error) => {
        console.error('❌ Gagal hapus kategori:', error)
      },
    })
  }

  const onSubmit = (data: PostFormValues) => {
    addPostMutation.mutate(data, {
      onSuccess: () => {
        router.push('/posts')
      },
      onError: (error) => {
        console.error('❌ Error:', error)
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
            <Button type="submit" disabled={addPostMutation.isLoading}>
              {addPostMutation.isLoading ? 'Menyimpan...' : 'Publikasikan'}
            </Button>
          </div>
        </div>

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
                      : 'Pilih kategori'}{' '}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari kategori..." />
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {isLoadingCategories ? (
                        <div className="text-muted-foreground p-4 text-sm">
                          Memuat kategori...
                        </div>
                      ) : (
                        categories.map((cat) => (
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
                        ))
                      )}
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
                  disabled={addCategoryMutation.isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      </form>
    </>
  )
}

export default AddPost
