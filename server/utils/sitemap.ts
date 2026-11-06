import { existsSync } from 'node:fs'
import path from 'node:path'
import { absoluteUrl } from '#shared/site'
import { listPosts } from './blog-store'

const STATIC_PATHS = ['/', '/check', '/batch-check', '/resources', '/blog']

const PLATFORM_PATHS = [
  '/chatgpt-ip-check',
  '/claude-ip-check',
  '/amazon-ip-check',
  '/ebay-ip-check',
  '/binance-ip-check',
]

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Include a platform landing only when its page file is actually in the app. */
function existingPlatformPaths(): string[] {
  const pagesDir = path.join(process.cwd(), 'app', 'pages')
  return PLATFORM_PATHS.filter((routePath) => existsSync(path.join(pagesDir, `${routePath.slice(1)}.vue`)))
}

function lastmod(date: string | undefined): string | undefined {
  if (!date) return undefined
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString().slice(0, 10)
}

function urlEntry(routePath: string, modified?: string): string {
  const loc = xmlEscape(absoluteUrl(routePath))
  const lastmodTag = modified ? `<lastmod>${xmlEscape(modified)}</lastmod>` : ''
  return `<url><loc>${loc}</loc>${lastmodTag}</url>`
}

export async function buildSitemapXml(): Promise<string> {
  const posts = await listPosts()
  const paths = [
    ...STATIC_PATHS.map((routePath) => urlEntry(routePath)),
    ...existingPlatformPaths().map((routePath) => urlEntry(routePath)),
    ...posts.map((post) => urlEntry(`/blog/${post.slug}`, lastmod(post.date))),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((entry) => `  ${entry}`).join('\n')}\n</urlset>\n`
}
