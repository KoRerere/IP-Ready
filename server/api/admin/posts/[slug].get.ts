import type { BlogPost } from '#shared/types/blog'
import { getPost } from '../../../utils/blog-store'

/** Fetch one post (any status) for editing. */
export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, 'slug') ?? '')
  const post = await getPost(slug)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
  return post
})
