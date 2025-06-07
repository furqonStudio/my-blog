export function generateFallbackTitle(content: string): string {
  const trimmedContent = content.trim()
  const preview = trimmedContent.slice(0, 20)
  const suffix = trimmedContent.length > 20 ? '...' : ''

  return preview
    ? `Draft: ${preview}${suffix}`
    : `Untitled Draft - ${new Date().toISOString()}`
}
