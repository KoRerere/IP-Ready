<script setup lang="ts">
import type { BlogPost, BlogPostListItem } from '#shared/types/blog'

const route = useRoute()
const { t } = useI18n()
const { localizePost, formatDate, formatReadTime } = useBlogLocale()

const slug = computed(() => String(route.params.slug ?? ''))

const { data, error } = await useAsyncData(
  () => `blog-post-${slug.value}`,
  () => $fetch<{ post: BlogPost; related: BlogPostListItem[] }>(`/api/posts/${slug.value}`),
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found.', fatal: true })
}

const post = computed(() => localizePost(data.value!.post))
const related = computed(() => data.value!.related.map(localizePost))

const siteUrl = 'https://ipready.cc'

function absoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value
  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFaqItems(source: string): Array<{ question: string; answer: string }> {
  const lines = source
    .replace(/\r\n?/g, '\n')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, title) => `\n${'#'.repeat(Number(level))} ${title}\n`)
    .replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '\n**$1**\n')
    .replace(/<br\s*\/?>|<\/(?:p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
  const items: Array<{ question: string; answer: string }> = []
  let faqDepth = 0
  let question = ''
  let answerParts: string[] = []
  const flush = () => {
    const answer = plainText(answerParts.join(' '))
    if (question && answer) items.push({ question, answer })
    question = ''
    answerParts = []
  }

  for (const line of lines) {
    const heading = /^\s*(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (heading) {
      flush()
      if (/^(?:FAQ\b|Frequently Asked Questions\b|常见问题|常見問題)/i.test(plainText(heading[2] ?? ''))) {
        faqDepth = heading[1]!.length
      } else if (faqDepth && heading[1]!.length <= faqDepth) {
        faqDepth = 0
      } else if (faqDepth && /[?？]$/.test(plainText(heading[2] ?? ''))) {
        question = plainText(heading[2] ?? '')
      }
      continue
    }
    if (!faqDepth) continue
    const match = /^\s*(?:\*\*|__)(.+?[?？])(?:\*\*|__)\s*(.*)$/.exec(line)
      || /^\s*(?:\*\*|__)?(?:Q|问|問)[:：]\s*(.+?[?？])(?:\*\*|__)?\s*(.*)$/i.exec(line)
    if (match) {
      flush()
      question = plainText(match[1] ?? '').replace(/^(?:Q|问|問)[:：]\s*/i, '')
      if (match[2]) answerParts.push(match[2])
    } else if (question && line.trim()) {
      answerParts.push(line.trim().replace(/^(?:A|答)[:：]\s*/i, ''))
    }
  }
  flush()
  return items
}

const articleJsonLd = computed(() => {
  const currentPost = post.value
  const source = currentPost.markdown || currentPost.body || ''
  const faqItems = extractFaqItems(source)
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: currentPost.title,
    datePublished: currentPost.date,
    author: {
      '@type': 'Organization',
      name: 'IP Ready Team',
    },
  }

  if (currentPost.coverImage) article.image = absoluteUrl(currentPost.coverImage)

  const graph: Record<string, unknown>[] = [article]
  if (faqItems.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  return graph
})

const articleSocial = computed(() => siteSocialMeta({
  path: `/blog/${post.value.slug}`,
  title: `${post.value.title} — IP Ready`,
  description: post.value.excerpt,
  image: post.value.coverImage || undefined,
  type: 'article',
}))
useHead(() => ({
  title: `${post.value.title} — IP Ready`,
  meta: [
    { name: 'description', content: post.value.excerpt },
    ...articleSocial.value.meta,
  ],
  script: [
    {
      key: 'article-jsonld',
      type: 'application/ld+json' as 'application/json',
      innerHTML: JSON.stringify(articleJsonLd.value),
    },
  ],
  link: [
    ...articleSocial.value.link,
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap',
    },
  ],
}))
</script>

<template>
  <div class="blog-page">
    <AppHeader />
    <main id="blog-top">
      <article>
        <div class="blog-article">
          <a href="/blog" class="blog-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            {{ t('blog.back') }}
          </a>

          <h1 class="blog-article-title">{{ post.title }}</h1>

          <div class="blog-article-meta">
            <span>{{ formatDate(post.date) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ formatReadTime(post.readTime) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ t('blog.by') }} {{ post.author }}</span>
          </div>

          <span class="blog-article-cover">
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="blog-article-cover-art"
            />
            <StoryCover v-else :variant="post.cover" class="blog-article-cover-art" />
          </span>

          <div v-if="post.body" class="blog-article-body" v-html="post.body" />
          <div v-else class="blog-article-body">
            <p>{{ post.excerpt }}</p>
          </div>
        </div>
      </article>

      <section class="blog-keep-reading">
        <div class="blog-keep-reading-inner">
          <h2 class="blog-keep-reading-label">{{ t('blog.keepReading') }}</h2>
          <div class="blog-keep-reading-grid">
            <a
              v-for="r in related"
              :key="r.slug"
              :href="`/blog/${r.slug}`"
              class="blog-keep-reading-card"
            >
              <img
                v-if="r.coverImage"
                :src="r.coverImage"
                :alt="r.title"
                class="blog-keep-reading-cover"
                loading="lazy"
                width="600" height="400"
              />
              <StoryCover v-else :variant="r.cover" class="blog-keep-reading-cover" />
              <span class="blog-keep-reading-date">{{ formatDate(r.date) }}</span>
              <span class="blog-keep-reading-title">{{ r.title }}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
