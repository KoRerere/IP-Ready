import type { BlogPostListItem } from '#shared/types/blog'

const SITE_URL = 'https://ipready.cc'

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]!)
}

export function buildSitemap(posts: Pick<BlogPostListItem, 'slug' | 'date'>[]): string {
  const entries = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    `  <url><loc>${SITE_URL}/blog</loc></url>`,
    `  <url><loc>${SITE_URL}/check</loc></url>`,
    `  <url><loc>${SITE_URL}/batch-check</loc></url>`,
    `  <url><loc>${SITE_URL}/resources</loc></url>`,
    `  <url><loc>${SITE_URL}/chatgpt-ip-check</loc></url>`,
    `  <url><loc>${SITE_URL}/claude-ip-check</loc></url>`,
    `  <url><loc>${SITE_URL}/amazon-ip-check</loc></url>`,
    `  <url><loc>${SITE_URL}/ebay-ip-check</loc></url>`,
    `  <url><loc>${SITE_URL}/binance-ip-check</loc></url>`,
    ...posts.map((post) => {
      const url = escapeXml(`${SITE_URL}/blog/${encodeURIComponent(post.slug)}`)
      const timestamp = Date.parse(post.date)
      const lastmod = Number.isFinite(timestamp)
        ? `<lastmod>${new Date(timestamp).toISOString()}</lastmod>`
        : ''
      return `  <url><loc>${url}</loc>${lastmod}</url>`
    }),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
}
