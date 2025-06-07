import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { Check, ChevronDown, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

export const CategorySelector = () => {
  const { control } = useFormContext()
  const [open, setOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')

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

  return (
    <FormField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem className="space-y-2 rounded-md border p-4">
          <FormLabel>Kategori</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {field.value
                  ? categories.find((cat) => cat.id === field.value)?.name ||
                    'Pilih kategori'
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
                      onSelect={() => {
                        field.onChange(cat.id)
                        setOpen(false)
                      }}
                    >
                      <div className="flex-1 cursor-pointer">{cat.name}</div>
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

          <div className="flex gap-2">
            <Input
              placeholder="Kategori baru"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleAddCategory()
                setNewCategory('')
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
