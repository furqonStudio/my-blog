import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Category } from '../category.type'

const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error('Gagal mengambil kategori')
  return (await res.json()) as Category[]
}

const addCategory = async (name: string): Promise<Category> => {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Gagal menambah kategori')
  return (await res.json()) as Category
}

const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Gagal menghapus kategori')
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}

export const useAddCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  // return useMutation({
  //   mutationFn: deleteCategory,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['categories'] })
  //   },
  // })
  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })

      const previous = queryClient.getQueryData<Category[]>(['categories'])
      queryClient.setQueryData<Category[]>(
        ['categories'],
        (old) => old?.filter((cat) => cat.id !== id) ?? [],
      )

      return { previous }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['categories'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
