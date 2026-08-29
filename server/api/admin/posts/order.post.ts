import type { BlogPost } from '#shared/types/blog'
import { getPost, reorderPosts } from '../../../utils/blog-store'

/** Persist a drag-and-drop ordering: body is the full ordered slug list. */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ slugs?: string[] }>(event)
  const slugs = body?.slugs
  if (!Array.isArray(slugs) || !slugs.length) {
    throw createError({ statusCode: 400, statusMessage: 'slugs array is required.' })
  }
  // Validate every slug exists before writing anything.
  for (const slug of slugs) {
    if (!await getPost(slug)) {
      throw createError({ statusCode: 400, statusMessage: `Unknown slug: ${slug}` })
    }
  }
  await reorderPosts(slugs)
  return { ok: true, count: slugs.length }
})
