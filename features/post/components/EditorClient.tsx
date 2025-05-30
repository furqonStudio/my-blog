// EditorClient.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import React, { memo } from 'react'

const Editor = dynamic(() => import('@/features/post/components/Editor'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full rounded-xl" />,
})

type Props = {
  value: string
  onChange: (val: string) => void
}

const EditorClient = memo(({ value, onChange }: Props) => {
  return (
    <div className="flex">
      <Editor value={value} onChange={onChange} />
    </div>
  )
})

EditorClient.displayName = 'EditorClient'

export default EditorClient
