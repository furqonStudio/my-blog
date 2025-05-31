'use client'

import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EditorClient from '@/features/post/components/EditorClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { ChevronDown, Upload } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Check, Plus, X } from 'lucide-react'

const postSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().refine(
    (val) => {
      const stripped = val.replace(/<[^>]+>/g, '').trim()
      return stripped.length > 0
    },
    {
      message: 'Konten wajib diisi',
    },
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
    watch,
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

  const [categories, setCategories] = useState<string[]>([
    'Teknologi',
    'Lifestyle',
    'Bisnis',
  ]) // data awal
  const [newCategory, setNewCategory] = useState('')
  const [open, setOpen] = useState(false)

  const handleAddCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed])
      setNewCategory('')
    }
  }

  const handleDeleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat))
  }

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: PostFormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      if (data.category) formData.append('category', data.category)
      if (data.image) formData.append('image', data.image)

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Gagal menyimpan post')

      const result = await res.json()
      console.log('✅ Post dibuat:', result)
      router.push('/posts')
    } catch (err) {
      console.error('❌ Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const contentValue = watch('content')
  console.log('📄 Content:', contentValue)

  return (
    <>
      <SiteHeader />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        {/* Form Utama */}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Publikasikan'}
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
                    {field.value ? field.value : 'Pilih kategori'}
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
                          key={cat}
                          value={cat}
                          onSelect={() => {
                            field.onChange(cat)
                            setOpen(false)
                          }}
                          className="flex items-center justify-between"
                        >
                          <span>{cat}</span>
                          {field.value === cat && (
                            <Check className="text-primary h-4 w-4" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCategory(cat)
                            }}
                          >
                            <X className="text-muted-foreground ml-2 h-4 w-4 hover:text-red-500" />
                          </button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Tambah kategori baru */}
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
      </form>
    </>
  )
}

export default AddPost
