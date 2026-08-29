import type { BlogPost } from '#shared/types/blog'
import { computeReadTime } from '#shared/utils/markdown'
import { nextOrder, savePost, slugExists, slugify, validatePost } from '../../utils/blog-store'

/** Create a new post. */
export default defineEventHandler(async (event) => {
  const input = await readBody<Partial<BlogPost>>(event)

  const payload: BlogPost = {
    slug: input.slug?.trim() || slugify(input.title ?? ''),
    title: input.title ?? 'Untitled',
    date: input.date?.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: input.readTime?.trim() || computeReadTime(input.markdown ?? ''),
    author: input.author?.trim() || 'IP Ready Team',
    category: input.category ?? 'resources',
    cover: input.cover ?? 'window',
    coverImage: input.coverImage,
    excerpt: input.excerpt ?? '',
    markdown: input.markdown ?? '',
    body: input.body,
    status: input.status ?? 'draft',
    order: await nextOrder(),
  }

  if (!payload.markdown?.trim() && !payload.body?.trim()) {
    throw createError({ statusCode: 400, statusMessage: '文章内容不能为空(请填写 Markdown 正文)。' })
  }

  const error = validatePost(payload)
  if (error) throw createError({ statusCode: 400, statusMessage: error })
  if (await slugExists(payload.slug)) {
    throw createError({ statusCode: 409, statusMessage: 'A post with this slug already exists.' })
  }

  setResponseStatus(event, 201)
  return savePost(payload)
})
