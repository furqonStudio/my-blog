import { useMutation } from '@tanstack/react-query'

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Gagal menyimpan post')
      }

      return res.json()
    },
  })
}
