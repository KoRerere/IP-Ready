<script setup lang="ts">
import type { BlogPost, BlogPostListItem } from '#shared/types/blog'

const route = useRoute()
const { t } = useI18n()

const slug = computed(() => String(route.params.slug ?? ''))

const { data, error } = await useAsyncData(
  () => `blog-post-${slug.value}`,
  () => $fetch<{ post: BlogPost; related: BlogPostListItem[] }>(`/api/posts/${slug.value}`),
  { watch: [slug] },
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found.', fatal: true })
}

const post = computed(() => data.value!.post)
const related = computed(() => data.value!.related)

useHead({
  title: () => `${post.value.title} — IP Ready`,
  meta: [{ name: 'description', content: () => post.value.excerpt }],
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
      <article>
        <div class="blog-article">
          <a href="/blog" class="blog-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Blog
          </a>

          <h1 class="blog-article-title">{{ post.title }}</h1>

          <div class="blog-article-meta">
            <span>{{ post.date }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ post.readTime }}</span>
            <span aria-hidden="true">·</span>
            <span>By: {{ post.author }}</span>
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
              <span class="blog-keep-reading-date">{{ r.date }}</span>
              <span class="blog-keep-reading-title">{{ r.title }}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
