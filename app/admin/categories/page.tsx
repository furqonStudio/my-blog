'use client'

import { SiteHeader } from '@/components/site-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
} from '@/features/categories/hooks/useCategories'
import { Trash } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Categories = () => {
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: categories, isLoading, isError } = useCategories()
  const addCategory = useAddCategory()
  const deleteCategory = useDeleteCategory()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addCategory.mutate(name, {
      onSuccess: () => {
        toast.success('Kategori berhasil ditambahkan.')
        setName('')
      },
      onError: () => {
        toast.error('Gagal menambahkan kategori.')
      },
    })
  }

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        toast.success('Kategori berhasil dihapus.')
        setSelectedId(null)
      },
      onError: () => {
        toast.error('Gagal menghapus kategori.')
      },
    })
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 overflow-auto px-4 md:py-6 lg:px-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <Input
                placeholder="Nama kategori"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Tambah
              </Button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && <p>Memuat kategori...</p>}
              {isError && (
                <p className="text-red-500">Gagal memuat kategori.</p>
              )}
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
                >
                  <span className="text-sm font-medium">{category.name}</span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setSelectedId(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Apakah kamu yakin ingin menghapus kategori ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Aksi ini tidak dapat dibatalkan. Kategori akan
                          terhapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => selectedId && handleDelete(selectedId)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories
