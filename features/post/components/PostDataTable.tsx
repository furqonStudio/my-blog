'use client'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { useDeletePost, usePosts } from '../hooks/usePosts'
import { Post } from '../post.type'
import { useRouter } from 'next/navigation'
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
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

type DialogState = {
  [postId: number]: boolean
}

function getColumns(
  router: ReturnType<typeof useRouter>,
  onDelete: (id: number) => void,
  openStates: DialogState,
  setOpenStates: Dispatch<SetStateAction<DialogState>>,
): ColumnDef<Post>[] {
  return [
    {
      accessorKey: 'imageUrl',
      header: 'Thumbnail',
      cell: ({ row }) => {
        const rawUrl = (row.getValue('imageUrl') as string | undefined) ?? ''
        const isLocal = rawUrl.startsWith('/')
        const baseLocalUrl = 'http://localhost:3000'
        const imageUrl = isLocal ? `${baseLocalUrl}${rawUrl}` : rawUrl

        return (
          <div className="bg-muted relative aspect-video w-full max-w-[96px] overflow-hidden rounded-md">
            <Image
              src={rawUrl ? imageUrl : '/placeholder.webp'}
              alt="Thumbnail"
              fill
              className="object-cover"
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.category?.name}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge variant="outline">{status ?? '-'}</Badge>
      },
    },
    {
      accessorKey: 'publishedAt',
      header: 'Published At',
      cell: ({ row }) => {
        const date = new Date(row.getValue('publishedAt'))
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const id = row.original.id

        const isOpen = openStates[id] ?? false

        const setOpen = (value: boolean) => {
          setOpenStates((prev) => ({
            ...prev,
            [id]: value,
          }))
        }

        const handleEdit = () => {
          router.push(`/admin/posts/edit/${id}`)
        }

        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <IconEdit className="text-muted-foreground h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <AlertDialog open={isOpen} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(true)}
                >
                  <IconTrash className="text-muted-foreground h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Apakah kamu yakin ingin menghapus post ini?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Aksi ini tidak dapat dibatalkan. Post akan terhapus secara
                    permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(id)
                      setOpen(false)
                    }}
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]
}

export default function PostDataTable() {
  const { data: posts = [], isLoading: isLoadingPosts } = usePosts()
  console.log('🚀 ~ PostDataTable ~ posts:', posts)
  const router = useRouter()
  const deletePost = useDeletePost()

  const [openStates, setOpenStates] = useState<DialogState>({})

  const handleDeletePost = (id: number) => {
    deletePost.mutate(String(id), {
      onSuccess: () => {
        toast.success('Berhasil menghapus post')
      },
      onError: (err) => {
        toast.error(err.message || 'Gagal menyimpan')
      },
    })
  }

  const columns = getColumns(
    router,
    handleDeletePost,
    openStates,
    setOpenStates,
  )

  if (isLoadingPosts) {
    return <Skeleton className="h-32 w-full" />
  }

  return <DataTable columns={columns} data={posts} />
}
