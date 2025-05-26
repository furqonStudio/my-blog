'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Editor = dynamic(() => import('@/features/post/components/Editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const EditorClient = () => {
  return (
    <div className="flex bg-blue-400">
      <Editor />
    </div>
  )
}

export default EditorClient
