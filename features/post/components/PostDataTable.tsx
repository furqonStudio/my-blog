'use client'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { Post } from '../post.type'
import { usePosts } from '../hooks/usePosts'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

const columns: ColumnDef<Post>[] = [
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
            src={rawUrl ? imageUrl : '/placeholder.png'}
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
    accessorKey: 'publishedAt',
    header: 'Published At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('publishedAt'))
      return (
        <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category
      return <Badge variant="outline">{category?.name ?? '-'}</Badge>
    },
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => <div>{row.getValue('author')}</div>,
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function PostDataTable() {
  const { data: posts = [], isLoading: isLoadingPosts } = usePosts()
  console.log('🚀 ~ PostDataTable ~ posts:', posts)

  if (isLoadingPosts) {
    return <Skeleton className="h-32 w-full" />
  }

  return <DataTable columns={columns} data={posts} />
}
