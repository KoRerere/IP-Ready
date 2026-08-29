<script setup lang="ts">
import type { BlogFilter, BlogPostListItem } from '#shared/types/blog'

const { t } = useI18n()

const FILTERS: { key: BlogFilter; label: string }[] = [
  { key: 'all', label: 'All Posts' },
  { key: 'changelog', label: 'Changelog' },
  { key: 'resources', label: 'Resources' },
]

const filter = ref<BlogFilter>('all')

const { data: posts, status } = await useAsyncData(
  'blog-posts',
  () => $fetch<BlogPostListItem[]>('/api/posts'),
  { default: () => [] },
)

const FEATURED = computed(() => posts.value[0])
const featured = computed(() => FEATURED.value && filter.value === 'all' ? posts.value.slice(1) : posts.value)

const filteredPosts = computed(() =>
  filter.value === 'all'
    ? featured.value
    : posts.value.filter((post) => post.category === filter.value),
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

useHead({
  title: () => t('blog.metaTitle'),
  meta: [{ name: 'description', content: () => t('blog.metaDescription') }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap',
    },
  ],
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

          <a v-if="FEATURED" class="blog-featured-card" :href="`blog/${FEATURED.slug}`">
            <img
              v-if="FEATURED.coverImage"
              :src="FEATURED.coverImage"
              :alt="FEATURED.title"
              class="blog-featured-cover"
              loading="lazy"
            />
            <StoryCover v-else :variant="FEATURED.cover" class="blog-featured-cover" />
          </a>
        </div>
      </section>

      <section class="blog-stories" id="stories">
        <div class="blog-stories-layout">
          <aside class="blog-filters" role="group" aria-label="Filter stories">
            <button
              v-for="item in FILTERS"
              :key="item.key"
              type="button"
              :aria-pressed="filter === item.key"
              :class="{ active: filter === item.key }"
              @click="filter = item.key"
            >
              {{ item.label }}
            </button>
          </aside>

          <div v-if="status === 'pending'" class="admin-loading">Loading posts…</div>

          <div v-else class="blog-grid">
            <article
              v-for="post in filteredPosts"
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
                    loading="lazy"
                  />
                  <StoryCover v-else :variant="post.cover" class="blog-card-cover" />
                </span>
                <span class="blog-card-body">
                  <span class="blog-card-meta">{{ post.date }} · {{ post.readTime }}</span>
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
