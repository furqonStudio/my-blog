export function getFormString(
  formData: FormData,
  key: string,
): string | undefined {
  const value = formData.get(key)
  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : value
  }
  return undefined
}

export function getFormFile(formData: FormData, key: string): File | undefined {
  const value = formData.get(key)
  if (value instanceof File && value.size > 0) {
    return value
  }
  return undefined
}
