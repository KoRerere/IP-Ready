<script setup lang="ts">
const { t } = useI18n()

const REASONS = [1, 2, 3, 4, 5] as const
const STEPS = [1, 2, 3, 4, 5, 6] as const
const FAQS = [1, 2, 3, 4] as const
const LINKS = [
  { href: '/blog/why-platforms-flag-your-ip', label: 'chatgpt.link.flags' },
  { href: '/blog/what-an-ip-risk-score-really-means', label: 'chatgpt.link.score' },
  { href: '/blog/is-my-ip-blacklisted', label: 'chatgpt.link.blacklist' },
  { href: '/blog/platform-ip-bans-explained', label: 'chatgpt.link.bans' },
] as const

useHead({
  title: () => t('chatgpt.metaTitle'),
  meta: [
    { name: 'description', content: () => t('chatgpt.metaDescription') },
    { property: 'og:title', content: () => t('chatgpt.metaTitle') },
    { property: 'og:description', content: () => t('chatgpt.metaDescription') },
  ],
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
    <main>
      <article>
        <div class="blog-article">
          <p class="blog-kicker">{{ t('chatgpt.kicker') }}</p>
          <h1 class="blog-article-title">{{ t('chatgpt.h1') }}</h1>
          <div class="blog-article-body">
            <p>{{ t('chatgpt.lead') }}</p>
            <p>
              <a class="blog-cta" href="/check">{{ t('chatgpt.cta') }}</a>
            </p>

            <h2>{{ t('chatgpt.whyTitle') }}</h2>
            <p v-for="n in REASONS" :key="n">
              <strong>{{ t(`chatgpt.why.${n}.title`) }}</strong>
              {{ t(`chatgpt.why.${n}.body`) }}
            </p>

            <h2>{{ t('chatgpt.scoreTitle') }}</h2>
            <p>{{ t('chatgpt.scoreBody') }}</p>

            <h2>{{ t('chatgpt.listTitle') }}</h2>
            <ul>
              <li v-for="n in STEPS" :key="n">{{ t(`chatgpt.step.${n}`) }}</li>
            </ul>

            <h2>{{ t('chatgpt.faqTitle') }}</h2>
            <p v-for="n in FAQS" :key="`faq-${n}`">
              <strong>{{ t(`chatgpt.faq.${n}.q`) }}</strong>
              {{ t(`chatgpt.faq.${n}.a`) }}
            </p>

            <p>
              <a class="blog-cta" href="/check">{{ t('chatgpt.cta') }}</a>
            </p>
          </div>
        </div>
      </article>

      <section class="blog-keep-reading">
        <div class="blog-keep-reading-inner">
          <h2 class="blog-keep-reading-label">{{ t('blog.keepReading') }}</h2>
          <div class="blog-keep-reading-grid">
            <a
              v-for="link in LINKS"
              :key="link.href"
              :href="link.href"
              class="blog-keep-reading-card"
            >
              <span class="blog-keep-reading-title">{{ t(link.label) }}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
