import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { BlogPost, BlogPostListItem } from '#shared/types/blog'
import { renderMarkdown } from '#shared/utils/markdown'
import { SEED_POSTS } from './seed-data'

const DATA_DIR = path.join(process.cwd(), 'server', 'data', 'posts')
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post'
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 120
}

/** Strip script/style blocks, inline event handlers, and javascript: URLs. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
}

let seedPromise: Promise<void> | undefined

async function ensureSeeded(): Promise<void> {
  seedPromise ??= (async () => {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const existing = await fs.readdir(DATA_DIR)
    if (existing.some((f) => f.endsWith('.json'))) return
    await Promise.all(SEED_POSTS.map((post, index) =>
      fs.writeFile(
        path.join(DATA_DIR, `${post.slug}.json`),
        JSON.stringify({ ...post, order: index }, null, 2),
        'utf8',
      ),
    ))
  })().catch((error) => {
    seedPromise = undefined
    throw error
  })
  return seedPromise
}

function sortByListOrder(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) =>
    ((a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    || ((Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)),
  )
}

async function readAll(): Promise<BlogPost[]> {
  await ensureSeeded()
  const files = await fs.readdir(DATA_DIR)
  const posts = await Promise.all(files
    .filter((f) => f.endsWith('.json'))
    .map(async (f) => {
      try {
        return JSON.parse(await fs.readFile(path.join(DATA_DIR, f), 'utf8')) as BlogPost
      } catch {
        return null
      }
    }))
  return sortByListOrder(posts.filter((p): p is BlogPost => p !== null && isValidSlug(p.slug)))
}

async function writePost(post: BlogPost): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(path.join(DATA_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2), 'utf8')
}

/** Next manual-order value (appends to the end of the list). */
export async function nextOrder(): Promise<number> {
  const posts = await readAll()
  return posts.reduce((max, p) => Math.max(max, p.order ?? 0), -1) + 1
}

/** Persist a new manual ordering from an ordered list of slugs. */
export async function reorderPosts(slugs: string[]): Promise<void> {
  await ensureSeeded()
  const order = new Map(slugs.map((slug, index) => [slug, index]))
  await Promise.all(slugs.map(async (slug) => {
    const file = path.join(DATA_DIR, `${slug}.json`)
    const post = JSON.parse(await fs.readFile(file, 'utf8')) as BlogPost
    post.order = order.get(slug)
    await fs.writeFile(file, JSON.stringify(post, null, 2), 'utf8')
  }))
}

export async function listPosts(options: { includeDrafts?: boolean } = {}): Promise<BlogPostListItem[]> {
  const posts = await readAll()
  return posts
    .filter((p) => options.includeDrafts || p.status === 'published')
    .map(({ body: _body, markdown: _markdown, ...listItem }) => listItem)
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await readAll()
  return posts.find((p) => p.slug === slug)
}

export async function getRelated(slug: string, count = 3): Promise<BlogPostListItem[]> {
  const posts = await readAll()
  return posts
    .filter((p) => p.slug !== slug && p.status === 'published')
    .slice(0, count)
    .map(({ body: _body, markdown: _markdown, ...listItem }) => listItem)
}

export async function slugExists(slug: string): Promise<boolean> {
  return getPost(slug).then((p) => p !== undefined)
}

/** Validate + normalize an incoming post payload. Returns error message or null. */
export function validatePost(input: Partial<BlogPost>): string | null {
  if (!input.title?.trim()) return 'Title is required.'
  if (!input.slug || !isValidSlug(input.slug)) return 'Slug must be lowercase letters, numbers, and dashes.'
  if (!Number.isFinite(Date.parse(input.date ?? ''))) return 'Date is invalid.'
  if (input.category !== null && input.category !== 'resources' && input.category !== 'changelog') return 'Category is invalid.'
  if (input.status !== 'draft' && input.status !== 'published' && input.status !== 'unpublished') return 'Status is invalid.'
  if (!input.excerpt?.trim()) return 'Excerpt is required.'
  return null
}

export async function savePost(input: BlogPost): Promise<BlogPost> {
  const post: BlogPost = {
    ...input,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    coverImage: input.coverImage?.trim() || undefined,
    // Markdown is the source of truth; fall back to an existing/seed HTML body.
    body: input.markdown?.trim() ? sanitizeHtml(renderPostHtml(input.markdown)) : (input.body ?? undefined),
  }
  await writePost(post)
  return post
}

export async function deletePostBySlug(slug: string): Promise<boolean> {
  await ensureSeeded()
  try {
    await fs.unlink(path.join(DATA_DIR, `${slug}.json`))
    return true
  } catch {
    return false
  }
}

function renderPostHtml(markdown: string): string {
  return renderMarkdown(markdown)
}
