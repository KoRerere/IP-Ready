import { deletePostBySlug } from '../../../utils/blog-store'

/** Delete a post by slug. */
export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, 'slug') ?? '')
  const deleted = await deletePostBySlug(slug)
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
  return { ok: true }
})
