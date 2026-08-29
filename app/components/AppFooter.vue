<script setup lang="ts">
const { t } = useI18n()

// reveal 入场：首页由页面级观察器处理，其他页面自行补充 visible，避免底栏一直隐藏
const footerBottom = ref<HTMLElement | null>(null)
let footerObserver: IntersectionObserver | undefined

onMounted(() => {
  const el = footerBottom.value
  if (!el || el.classList.contains('visible')) return
  footerObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        el.classList.add('visible')
        footerObserver?.disconnect()
      }
    }
  }, { threshold: 0.2 })
  footerObserver.observe(el)
})

onBeforeUnmount(() => footerObserver?.disconnect())
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="footer-grid">
        <a class="footer-mark" href="#top" aria-label="IP Ready home">
          <img src="/assets/figma/imgLogo.svg" alt="" />
          <span>IP Ready</span>
        </a>
        <div>
          <h3>{{ t('footer.platform') }}</h3>
          <a href="#top">{{ t('nav.checkAnother') }}</a>
          <a href="#readiness">{{ t('nav.batchCheck') }}</a>
          <a href="#readiness">{{ t('footer.platformReadiness') }}</a>
        </div>
        <div>
          <h3>{{ t('footer.useCases') }}</h3>
          <a href="#readiness">{{ t('tabs.ai') }}</a>
          <a href="#readiness">{{ t('tabs.ecommerce') }}</a>
          <a href="#readiness">{{ t('tabs.advertising') }}</a>
          <a href="#readiness">{{ t('tabs.social') }}</a>
        </div>
        <div>
          <h3>{{ t('footer.ipIntelligence') }}</h3>
          <a href="#top">{{ t('footer.aiScore') }}</a>
          <a href="/#information">{{ t('footer.ipInformation') }}</a>
          <a href="/#information">{{ t('footer.fraudSignals') }}</a>
        </div>
        <div>
          <h3>{{ t('footer.resources') }}</h3>
          <a href="/#information">{{ t('footer.resources') }}</a>
          <a href="#faq">{{ t('nav.blog') }}</a>
          <a href="#faq">{{ t('footer.faq') }}</a>
        </div>
        <div>
          <h3>{{ t('footer.company') }}</h3>
          <a href="#faq">{{ t('nav.partners') }}</a>
          <a href="mailto:hello@ip-ready.example">{{ t('nav.contact') }}</a>
        </div>
      </div>
      <div ref="footerBottom" class="footer-bottom reveal">
        <span>{{ t('footer.rights') }}</span>
        <span class="systems"><i></i>{{ t('footer.systems') }}</span>
      </div>
      <div class="footer-wordmark" aria-hidden="true">
        <p>IP Ready</p>
      </div>
    </div>
  </footer>
</template>
