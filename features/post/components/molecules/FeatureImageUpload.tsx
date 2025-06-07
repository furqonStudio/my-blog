import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export const FeatureImageUpload = () => {
  const { control, watch } = useFormContext()
  const imageFile = watch('image')
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile)
      setPreviewUrl(url)

      // Cleanup
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (typeof imageFile === 'string') {
      setPreviewUrl(imageFile) // URL dari server
    } else {
      setPreviewUrl(undefined)
    }
  }, [imageFile])

  return (
    <FormField
      control={control}
      name="image"
      render={({ field: { onChange } }) => (
        <FormItem className="space-y-2 rounded-md border p-4">
          <FormLabel>Gambar Fitur</FormLabel>
          <FormControl>
            <label
              htmlFor="image-upload"
              className="group relative flex aspect-video w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition hover:border-gray-400"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Upload className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
                  <p className="text-sm text-gray-400 group-hover:text-gray-600">
                    Upload gambar fitur
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    onChange(file)
                  }
                }}
              />
            </label>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
