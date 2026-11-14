/** Site-wide SEO helpers for canonical, Open Graph, and Twitter cards. */

export const SITE_URL = 'https://ipready.cc'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/blog-covers/cover-what-is-ip-risk-score.webp`

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function resolveText(value: string | (() => string)): string {
  return typeof value === 'function' ? value() : value
}

export function siteSocialMeta(options: {
  path: string
  title: string | (() => string)
  description: string | (() => string)
  image?: string
  type?: string
}) {
  const title = () => resolveText(options.title)
  const description = () => resolveText(options.description)
  const url = absoluteUrl(options.path)
  const image = options.image ? absoluteUrl(options.image) : DEFAULT_OG_IMAGE
  const type = options.type ?? 'website'

  return {
    meta: [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [{ rel: 'canonical', href: url }],
  }
}

export function useSiteSeo(options: {
  path: string
  title: string | (() => string)
  description: string | (() => string)
  image?: string
  type?: string
  extraMeta?: Array<Record<string, unknown>>
  extraLink?: Array<Record<string, unknown>>
  extraScript?: Array<Record<string, unknown>>
}) {
  const social = siteSocialMeta(options)
  useHead({
    title: options.title,
    meta: [
      { name: 'description', content: options.description },
      ...social.meta,
      ...(options.extraMeta ?? []),
    ],
    link: [
      ...social.link,
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap',
      },
      ...(options.extraLink ?? []),
    ],
    script: options.extraScript,
  })
}
