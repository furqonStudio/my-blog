import { Button } from '@/components/ui/button'
import { isEditorContentEmpty } from '@/utils/editor'
import { UseFormSetValue } from 'react-hook-form'
import { CreatePostSchema } from '../organisms/PostForm'

interface PostActionsProps {
  isSubmitting: boolean
  setValue: UseFormSetValue<CreatePostSchema>
  title?: string
  content?: string
  category?: string
  image?: File | string | undefined
}

const PostActions = ({
  isSubmitting,
  setValue,
  title,
  content,
  category,
  image,
}: PostActionsProps) => {
  const isAllEmpty =
    !title?.trim() &&
    isEditorContentEmpty(content) &&
    !category &&
    !(image instanceof File)

  return (
    <div className="flex gap-2">
      <Button
        type="submit"
        disabled={isSubmitting || isAllEmpty}
        onClick={() => {
          setValue('status', 'PUBLISHED')
        }}
      >
        {isSubmitting ? 'Menyimpan...' : 'Publikasikan'}
      </Button>
      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting || isAllEmpty}
        onClick={() => {
          setValue('status', 'DRAFT')
        }}
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan sebagai Draf'}
      </Button>
    </div>
  )
}

export default PostActions
