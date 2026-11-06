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

export interface SiteSocialInput {
  path?: string
  title: string
  description: string
  image?: string | null
  type?: string
}

/** Open Graph, Twitter, and canonical tags. Description stays on the caller. */
export function siteSocialMeta(input: SiteSocialInput) {
  const url = absoluteUrl(input.path || '/')
  const image = absoluteUrl(input.image?.trim() || DEFAULT_OG_IMAGE_PATH)
  const type = input.type || 'website'
  return {
    meta: [
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  }
}

/**
 * Canonical URL plus Open Graph and Twitter card tags.
 * Title, description, URL, and image accept refs so locale and post data stay in sync.
 */
export function useSiteSeo(options: SiteSeoOptions) {
  const route = useRoute()
  const title = computed(() => toValue(options.title))
  const description = computed(() => toValue(options.description))
  const social = computed(() => siteSocialMeta({
    path: toValue(options.path) || route.path || '/',
    title: title.value,
    description: description.value,
    image: toValue(options.image),
    type: toValue(options.type),
  }))

  useHead({
    title,
    meta: computed(() => [
      { name: 'description', content: description.value },
      ...social.value.meta,
    ]),
    link: computed(() => social.value.link),
  })
}
