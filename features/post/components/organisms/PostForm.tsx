'use client'

import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema } from '@/features/post/post.schema'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import EditorClient from '../EditorClient'
import { CategorySelector } from '../molecules/CategorySelector'
import { FeatureImageUpload } from '../molecules/FeatureImageUpload'
import PostActions from '../molecules/PostActions'
import { useEffect } from 'react'

export type CreatePostSchema = z.infer<typeof createPostSchema>

interface PostFormProps {
  onSubmit: (data: CreatePostSchema) => void
  isSubmitting: boolean
  defaultValues?: Partial<CreatePostSchema>
}

export const PostForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
}: PostFormProps) => {
  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues,
  })

  const { control, handleSubmit, watch, setValue } = form
  const title = watch('title')
  const content = watch('content')
  const category = watch('categoryId')
  const image = watch('image')

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-6 md:flex-row"
      >
        <div className="flex flex-1 flex-col gap-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Artikel</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder="Judul artikel"
                    className="px-3 py-5 text-3xl font-bold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konten</FormLabel>
                <FormControl>
                  <EditorClient
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PostActions
            isSubmitting={isSubmitting}
            setValue={setValue}
            title={title}
            content={content}
            category={category}
            image={image}
          />
        </div>

        <div className="space-y-4">
          <CategorySelector />
          <FeatureImageUpload />
        </div>
      </form>
    </Form>
  )
}
