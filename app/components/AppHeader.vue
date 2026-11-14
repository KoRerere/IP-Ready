<script setup lang="ts">
const { t } = useI18n()
const menuOpen = ref(false)
const morph = ref(false)

// "Platform Checks" dropdown: opens on hover / keyboard focus on desktop, toggles on tap
const platformOpen = ref(false)
const platformLinks = computed(() => [
  { href: '/chatgpt-ip-check', icon: '/assets/platform/chatgpt.svg', label: t('nav.chatgptCheck') },
  { href: '/claude-ip-check', icon: '/assets/platform/claude.svg', label: t('nav.claudeCheck') },
])
// with a mouse, hover already opened it, so a click must not close it again; on touch, tap toggles
function onPlatformClick() {
  platformOpen.value = window.matchMedia('(hover: hover)').matches ? true : !platformOpen.value
}
function onPlatformFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (!next || !(event.currentTarget as HTMLElement).contains(next)) platformOpen.value = false
}
// sliding highlight between the dropdown items, same motion as the nav / language pills
const platformPill = reactive({ y: 0, h: 0, visible: false, snap: false })
function movePlatformPill(event: Event) {
  if (!window.matchMedia('(min-width: 901px) and (hover: hover)').matches || menuOpen.value) return
  const item = event.currentTarget as HTMLElement
  platformPill.y = item.offsetTop
  platformPill.h = item.offsetHeight
  if (!platformPill.visible) {
    // first appearance jumps into place instead of sliding in from the top
    platformPill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { platformPill.snap = false }))
  }
  platformPill.visible = true
}
function hidePlatformPill() {
  platformPill.visible = false
}
watch(platformOpen, (value) => { if (!value) platformPill.visible = false })

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
        <a href="/batch-check" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.batchCheck') }}</a>
        <div class="nav-dropdown" :class="{ open: platformOpen }" @mouseenter="(e) => { moveNavPill(e); platformOpen = true }" @mouseleave="platformOpen = false" @focusin="platformOpen = true" @focusout="onPlatformFocusOut" @keydown.esc="platformOpen = false">
          <button class="nav-dropdown-toggle" type="button" aria-haspopup="true" :aria-expanded="platformOpen" @click="onPlatformClick">
            <span>{{ t('nav.platformChecks') }}</span>
            <svg class="nav-dropdown-chevron" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <div class="nav-dropdown-panel">
            <div class="nav-dropdown-menu" @mouseleave="hidePlatformPill">
              <span class="nav-dropdown-pill" :class="{ visible: platformPill.visible, snap: platformPill.snap }" :style="{ transform: `translateY(${platformPill.y}px)`, height: `${platformPill.h}px` }" aria-hidden="true"></span>
              <a v-for="item in platformLinks" :key="item.href" :href="item.href" @mouseenter="movePlatformPill" @focus="movePlatformPill" @click="menuOpen = false; platformOpen = false"><img :src="item.icon" alt="" width="20" height="20" /><span>{{ item.label }}</span></a>
            </div>
          </div>
        </div>
        <a href="/resources" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.resources') }}</a>
        <a href="/blog" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.blog') }}</a>
        <!-- Partners 暂时隐藏，需要时取消注释即可 -->
        <!-- <a href="/#faq" @mouseenter="moveNavPill" @focus="moveNavPill" @click="menuOpen = false">{{ t('nav.partners') }}</a> -->
      </nav>
      <!-- Contact us 暂时隐藏，需要时取消注释即可 -->
      <!-- <a class="contact-link" href="mailto:hello@ip-ready.example">{{ t('nav.contact') }}</a> -->
      <LanguageSwitcher />
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* Platform Checks dropdown — trigger matches the other nav links, panel matches the language switcher */
.nav-dropdown { position: relative; z-index: 1; }
.nav-dropdown-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 0; border-radius: 6px; background: transparent; color: var(--ink-soft); font: inherit; font-size: 14px; font-weight: 500; line-height: 20px; cursor: pointer; transition: color .2s; }
.nav-dropdown:hover .nav-dropdown-toggle, .nav-dropdown.open .nav-dropdown-toggle, .nav-dropdown-toggle:focus-visible { color: #0a0a0a; }
.nav-dropdown-chevron { width: 10px; height: 6px; transition: transform .25s cubic-bezier(.34, 1.56, .64, 1); }
.nav-dropdown.open .nav-dropdown-chevron { transform: rotate(180deg); }
/* padding-top bridges the gap so the panel stays open while the pointer travels down to it */
.nav-dropdown-panel { position: absolute; top: 100%; left: 0; z-index: 40; padding-top: 10px; opacity: 0; transform: translateY(-6px) scale(.96); transform-origin: top left; visibility: hidden; pointer-events: none; transition: opacity .16s ease, transform .2s ease, visibility 0s linear .2s; }
.nav-dropdown.open .nav-dropdown-panel { opacity: 1; transform: none; visibility: visible; pointer-events: auto; transition: opacity .22s ease, transform .3s cubic-bezier(.34, 1.45, .64, 1), visibility 0s; }
.nav-dropdown-menu { position: relative; display: flex; min-width: 210px; flex-direction: column; padding: 7px; border: 1px solid rgba(0, 0, 0, .06); border-radius: 10px; background: #fff; box-shadow: 0 8px 24px rgba(15, 23, 42, .07); }
.desktop-nav .nav-dropdown-menu a { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 6px; font-size: 13px; line-height: 18px; white-space: nowrap; transition: color .15s, background-color .15s; }
.desktop-nav .nav-dropdown-menu a:hover, .desktop-nav .nav-dropdown-menu a:focus-visible { color: #0a0a0a; }
.desktop-nav .nav-dropdown-menu a:focus-visible { background: #f1f5f8; }
/* the sliding pill replaces a per-item hover background */
.nav-dropdown-pill { position: absolute; top: 0; left: 7px; right: 7px; z-index: 0; height: 0; border-radius: 6px; background: #f1f5f8; opacity: 0; pointer-events: none; transition: transform .45s cubic-bezier(.3, 1.35, .45, 1), height .45s cubic-bezier(.3, 1.35, .45, 1), opacity .2s ease; }
.nav-dropdown-pill.visible { opacity: 1; }
.nav-dropdown-pill.snap { transition: opacity .2s ease; }
@media (max-width: 900px) { .nav-dropdown-pill { display: none; } }
.nav-dropdown-menu img { width: 20px; height: 20px; flex: 0 0 auto; }
@media (max-width: 1200px) { .nav-dropdown-toggle { padding-inline: 10px; } }
/* mobile menu: no hover — show the two entries as an indented sub-list under the label */
@media (max-width: 900px) {
  .site-header.open .nav-dropdown-toggle { width: 100%; padding: 12px; cursor: default; }
  .site-header.open .nav-dropdown-chevron { display: none; }
  .site-header.open .nav-dropdown-panel { position: static; padding: 0 0 4px 12px; opacity: 1; transform: none; visibility: visible; pointer-events: auto; transition: none; }
  .site-header.open .nav-dropdown-menu { min-width: 0; padding: 0; border: 0; box-shadow: none; }
  .site-header.open .desktop-nav .nav-dropdown-menu a { padding: 10px 12px; }
}
@media (prefers-reduced-motion: reduce) { .nav-dropdown-panel, .nav-dropdown.open .nav-dropdown-panel, .nav-dropdown-chevron { transition: none; } }
</style>
