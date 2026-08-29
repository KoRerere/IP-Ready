import { getPost, getRelated } from '../../utils/blog-store'

/** Public article endpoint: published posts only, with rendered body + related list. */
export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, 'slug') ?? '')
  const post = await getPost(slug)
  if (!post || post.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
  }
  return { post, related: await getRelated(slug) }
})
