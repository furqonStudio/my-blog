'use client'

import RichTextEditor from 'reactjs-tiptap-editor'
import { BaseKit } from 'reactjs-tiptap-editor'
import 'reactjs-tiptap-editor/style.css'

import React, { useState } from 'react'

const extensions = [
  BaseKit.configure({
    // Show placeholder
    placeholder: {
      showOnlyCurrent: true,
    },

    // Character count
    characterCount: {
      limit: 50_000,
    },
  }),
]

const DEFAULT = ''

const PostEditor = () => {
  const [content, setContent] = useState(DEFAULT)

  const onChangeContent = (value: any) => {
    setContent(value)
  }

  return (
    <RichTextEditor
      output="html"
      content={content}
      onChangeContent={onChangeContent}
      extensions={extensions}
    />
  )
}

export default PostEditor
