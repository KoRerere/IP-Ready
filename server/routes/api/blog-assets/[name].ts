import { promises as fs } from 'node:fs'
import path from 'node:path'

const FILE_RE = /^cover-[0-9]+-[a-f0-9-]+\.(png|jpg|webp|gif)$/
const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
}

export default defineEventHandler(async (event) => {
  const filename = String(getRouterParam(event, 'name') ?? '')
  if (!FILE_RE.test(filename)) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found.' })
  }

  const roots = new Set<string>()
  for (const start of [process.cwd(), path.dirname(process.execPath)]) {
    let current = path.resolve(start)
    for (let depth = 0; depth < 7; depth += 1) {
      roots.add(path.join(current, 'server', 'data', 'uploads'))
      roots.add(path.join(current, 'app', 'server', 'data', 'uploads'))
      const parent = path.dirname(current)
      if (parent === current) break
      current = parent
    }
  }

  try {
    let data: Buffer | undefined
    for (const root of roots) {
      try {
        data = await fs.readFile(path.join(root, filename))
        break
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      }
    }
    if (!data) throw createError({ statusCode: 404, statusMessage: 'Image not found.' })
    const extension = filename.split('.').pop() ?? ''
    setResponseHeader(event, 'Content-Type', CONTENT_TYPES[extension] ?? 'application/octet-stream')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
    return data
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Image not found.' })
    }
    throw error
  }
})
