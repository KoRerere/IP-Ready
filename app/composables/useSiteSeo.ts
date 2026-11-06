import type { MaybeRefOrGetter } from 'vue'
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH, SITE_URL } from '#shared/site'

export { absoluteUrl, DEFAULT_OG_IMAGE_PATH, SITE_URL }

export interface SiteSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /** Site path or absolute URL. Defaults to the current route path. */
  path?: MaybeRefOrGetter<string>
  /** Site path or absolute image URL. Falls back to the default OG image. */
  image?: MaybeRefOrGetter<string | null | undefined>
  /** Open Graph type, usually `website` or `article`. */
  type?: MaybeRefOrGetter<string>
}

/**
 * Canonical URL plus Open Graph and Twitter card tags.
 * Title, description, URL, and image accept refs so locale and post data stay in sync.
 */
export function useSiteSeo(options: SiteSeoOptions) {
  const route = useRoute()
  const title = computed(() => toValue(options.title))
  const description = computed(() => toValue(options.description))
  const type = computed(() => toValue(options.type) || 'website')
  const url = computed(() => absoluteUrl(toValue(options.path) || route.path || '/'))
  const image = computed(() => {
    const value = toValue(options.image)?.trim()
    return absoluteUrl(value || DEFAULT_OG_IMAGE_PATH)
  })

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
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
    link: [
      { rel: 'canonical', href: url },
    ],
  })
}
