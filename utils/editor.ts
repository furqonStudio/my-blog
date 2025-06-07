export function isEditorContentEmpty(content?: string): boolean {
  return !content || content.replace(/<[^>]+>/g, '').trim() === ''
}
