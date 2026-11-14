<script setup lang="ts">
import type { BlogFilter, BlogPostListItem } from '#shared/types/blog'

const { t } = useI18n()
const { localizePost, formatDate, formatReadTime } = useBlogLocale()

const FILTERS: { key: BlogFilter; label: string }[] = [
  { key: 'all', label: 'blog.filter.allPosts' },
  { key: 'changelog', label: 'blog.filter.changelog' },
  { key: 'resources', label: 'blog.filter.resources' },
]

const filter = ref<BlogFilter>('all')

const { data: posts, status } = await useAsyncData(
  'blog-posts',
  () => $fetch<BlogPostListItem[]>('/api/posts'),
  { default: () => [] },
)

const localizedPosts = computed(() => posts.value.map(localizePost))
const FEATURED = computed(() => localizedPosts.value[0])
const featured = computed(() => FEATURED.value && filter.value === 'all' ? localizedPosts.value.slice(1) : localizedPosts.value)

const filteredPosts = computed(() =>
  filter.value === 'all'
    ? featured.value
    : localizedPosts.value.filter((post) => post.category === filter.value),
)

let revealObserver: IntersectionObserver | undefined

onMounted(() => {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver?.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -60px 0px' },
  )

  document.querySelectorAll('.blog-page .scroll-reveal-item').forEach((element) => {
    revealObserver?.observe(element)
  })
})

onBeforeUnmount(() => revealObserver?.disconnect())

useSiteSeo({
  path: '/blog',
  title: () => t('blog.metaTitle'),
  description: () => t('blog.metaDescription'),
})
</script>

<template>
  <div class="blog-page">
    <AppHeader />
    <main id="blog-top">
      <section class="blog-hero">
        <div class="blog-hero-inner">
          <div class="blog-hero-copy">
            <p class="blog-kicker">{{ t('blog.kicker') }}</p>
            <h1 class="blog-hero-title">{{ t('blog.heroTitle') }}</h1>
            <p class="blog-hero-sub">{{ t('blog.heroSub') }}</p>
          </div>

          <a v-if="FEATURED" class="blog-featured-card" :href="`blog/${FEATURED.slug}`" :aria-label="FEATURED.title">
            <img
              v-if="FEATURED.coverImage"
              :src="FEATURED.coverImage"
              :alt="FEATURED.title"
              class="blog-featured-cover"
              loading="eager"
              fetchpriority="high"
              width="930" height="624"
            />
            <StoryCover v-else :variant="FEATURED.cover" class="blog-featured-cover" />
          </a>
        </div>
      </section>

      <section class="blog-stories" id="stories">
        <div class="blog-stories-layout">
          <aside class="blog-filters" role="group" :aria-label="t('blog.filter.label')">
            <button
              v-for="item in FILTERS"
              :key="item.key"
              type="button"
              :aria-pressed="filter === item.key"
              :class="{ active: filter === item.key }"
              @click="filter = item.key"
            >
              {{ t(item.label) }}
            </button>
          </aside>

          <div v-if="status === 'pending'" class="admin-loading">{{ t('blog.loading') }}</div>

          <div v-else class="blog-grid">
            <article
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              class="blog-card scroll-reveal-item"
            >
              <a :href="`blog/${post.slug}`" class="blog-card-link">
                <span class="blog-card-media">
                  <img
                    v-if="post.coverImage"
                    :src="post.coverImage"
                    :alt="post.title"
                    class="blog-card-cover"
                    :loading="index < 2 ? 'eager' : 'lazy'"
                    :fetchpriority="index < 2 ? 'high' : 'auto'"
                    width="930" height="624"
                  />
                  <StoryCover v-else :variant="post.cover" class="blog-card-cover" />
                </span>
                <span class="blog-card-body">
                  <span class="blog-card-meta">{{ formatDate(post.date) }} · {{ formatReadTime(post.readTime) }}</span>
                  <span class="blog-card-title">{{ post.title }}</span>
                </span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section class="blog-newsletter">
        <div class="blog-newsletter-inner">
          <div>
            <p class="blog-kicker blog-newsletter-kicker">{{ t('blog.newsKicker') }}</p>
            <h2 class="blog-section-title blog-newsletter-title">{{ t('blog.newsTitle') }}</h2>
          </div>
          <a class="blog-cta" href="mailto:hello@ip-ready.example">
            {{ t('blog.newsCta') }}
          </a>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
