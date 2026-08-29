import type { BlogPost } from '#shared/types/blog'
import { computeReadTime } from '#shared/utils/markdown'
import { getPost, savePost, slugExists, validatePost } from '../../../utils/blog-store'

/** Update an existing post. Slug change is supported when the new slug is free. */
export default defineEventHandler(async (event) => {
  const currentSlug = String(getRouterParam(event, 'slug') ?? '')
  const existing = await getPost(currentSlug)
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Post not found.' })

  const input = await readBody<Partial<BlogPost>>(event)
  const nextSlug = input.slug?.trim() || currentSlug

  const error = validatePost({
    ...existing,
    ...input,
    slug: nextSlug,
    date: input.date ?? existing.date,
    excerpt: input.excerpt ?? existing.excerpt,
  })
  if (error) throw createError({ statusCode: 400, statusMessage: error })

  if (nextSlug !== currentSlug && await slugExists(nextSlug)) {
    throw createError({ statusCode: 409, statusMessage: 'A post with this slug already exists.' })
  }

  const merged: BlogPost = {
    ...existing,
    ...input,
    slug: nextSlug,
    readTime: input.markdown?.trim()
      ? (input.readTime?.trim() || computeReadTime(input.markdown))
      : (input.readTime?.trim() || existing.readTime),
  }

  const saved = await savePost(merged)
  if (nextSlug !== currentSlug) {
    const { deletePostBySlug } = await import('../../../utils/blog-store')
    await deletePostBySlug(currentSlug)
  }
  return saved
})
