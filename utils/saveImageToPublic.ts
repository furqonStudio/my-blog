import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function saveImageToPublic(
  buffer: Buffer,
  ext: string,
): Promise<string | null> {
  try {
    const fileName = `${uuidv4()}${ext}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

    await fs.writeFile(filePath, buffer)

    return `/uploads/${fileName}`
  } catch (error) {
    console.error('Gagal menyimpan gambar:', error)
    return null
  }
}
