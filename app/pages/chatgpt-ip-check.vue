<script setup lang="ts">
const { t } = useI18n()

useSiteSeo({
  title: () => t('chatgpt.metaTitle'),
  description: () => t('chatgpt.metaDescription'),
  path: '/chatgpt-ip-check',
})

useHead({
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
            <h2>{{ t('chatgpt.whyTitle') }}</h2>
            <p><strong>{{ t('chatgpt.datacenterTitle') }}. </strong>{{ t('chatgpt.datacenterBody') }}</p>
            <p><strong>{{ t('chatgpt.blacklistTitle') }}. </strong>{{ t('chatgpt.blacklistBody') }}</p>
            <p><strong>{{ t('chatgpt.regionTitle') }}. </strong>{{ t('chatgpt.regionBody') }}</p>
            <h2>{{ t('chatgpt.ctaTitle') }}</h2>
            <p>{{ t('chatgpt.ctaBody') }}</p>
            <p><a class="blog-cta" href="/check">{{ t('chatgpt.cta') }}</a></p>
          </div>
        </div>
      </article>
    </main>
    <AppFooter />
  </div>
</template>
