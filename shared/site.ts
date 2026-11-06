export const SITE_URL = 'https://ipready.cc'

/**
 * Social preview image. `public/blog-covers/cover-what-is-ip-risk-score.webp`
 * is not in this repo; this is the existing risk-score cover.
 */
export const DEFAULT_OG_IMAGE_PATH = '/blog-covers/what-is-ip-risk-score-v10.webp'

/** Turn a site path or absolute URL into a canonical https://ipready.cc URL. */
export function absoluteUrl(path = '/'): string {
  const value = path.trim()
  if (/^https?:\/\//i.test(value)) return value
  const normalized = value.startsWith('/') ? value : `/${value}`
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}`
}
