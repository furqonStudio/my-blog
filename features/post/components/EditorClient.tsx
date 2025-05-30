'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Editor = dynamic(() => import('@/features/post/components/Editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type Props = {
  value: string
  onChange: (val: string) => void
}

const EditorClient = ({ value, onChange }: Props) => {
  return (
    <div className="flex bg-blue-400">
      <Editor value={value} onChange={onChange} />
    </div>
  )
}

export default EditorClient
