<script setup lang="ts">
const { t } = useI18n()
const menuOpen = ref(false)
const morph = ref(false)

const navPill = reactive({ x: 0, w: 0, visible: false, snap: false })

function moveNavPill(event: Event) {
  if (!window.matchMedia('(min-width: 901px)').matches || menuOpen.value) return
  const link = event.currentTarget as HTMLElement
  navPill.x = link.offsetLeft
  navPill.w = link.offsetWidth
  if (!navPill.visible) {
    // 首次出现时直接就位，不播放从左缘滑入的动画
    navPill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { navPill.snap = false }))
  }
  navPill.visible = true
}

function hideNavPill() {
  navPill.visible = false
}

function onScroll() {
  morph.value = window.scrollY > 24
}

function onResize() {
  navPill.visible = false
}

onMounted(() => {
  // 标签页被冻结后恢复时，浏览器还原滚动位置不触发 scroll 事件，需主动同步
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onScroll)
  window.addEventListener('pageshow', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onScroll)
  window.removeEventListener('pageshow', onScroll)
})
</script>

<template>
  <header class="site-header" :class="{ open: menuOpen, morph: morph && !menuOpen }">
    <div class="site-header-inner">
      <a class="brand" href="/#top" aria-label="IP Ready home" @click="menuOpen = false">
        <img src="/assets/figma/imgLogo.svg" alt="" />
        <span>IP Ready</span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation" @mouseleave="hideNavPill">
        <span class="nav-morph-pill" :class="{ visible: navPill.visible, snap: navPill.snap }" :style="{ transform: `translate(${navPill.x}px, -50%)`, width: `${navPill.w}px` }" aria-hidden="true"></span>
        <a href="/check" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.checkAnother') }}</a>
        <a href="/#readiness" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.batchCheck') }}</a>
        <a href="/#information" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.resources') }}</a>
        <a href="/blog" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.blog') }}</a>
        <!-- Partners 暂时隐藏，需要时取消注释即可 -->
        <!-- <a href="/#faq" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.partners') }}</a> -->
      </nav>
      <a class="contact-link" href="mailto:hello@ip-ready.example">{{ t('nav.contact') }}</a>
      <LanguageSwitcher />
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </button>
    </div>
  </header>
</template>
