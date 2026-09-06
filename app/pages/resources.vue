<script setup lang="ts">
const { t } = useI18n()

const IP_TYPES = ['datacenter', 'static', 'rotating', 'mobile'] as const

const TYPE_IMAGES = {
  datacenter: '/assets/resources/datacenter.jpg',
  static: '/assets/resources/static.jpg',
  rotating: '/assets/resources/rotating.jpg',
  mobile: '/assets/resources/mobile.jpg',
} as const

const GLOSSARY_KEYS = [
  'ip', 'ipv4', 'isp', 'asn', 'datacenter', 'residential', 'mobile', 'cgnat',
  'proxy', 'vpn', 'tor', 'dnsbl', 'score', 'rotation', 'geo',
] as const

/* 术语表滑动胶囊：与顶部导航的 morph pill 同一套动画参数 */
const termPill = reactive({ x: 0, y: 0, w: 0, h: 0, visible: false, snap: false })

function moveTermPill(event: Event) {
  const term = event.currentTarget as HTMLElement
  termPill.x = term.offsetLeft - 22
  termPill.y = term.offsetTop - 10
  termPill.w = term.offsetWidth + 44
  termPill.h = term.offsetHeight + 20
  if (!termPill.visible) {
    // 首次出现时直接就位，不播放从左上角滑入的动画
    termPill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { termPill.snap = false }))
  }
  termPill.visible = true
}

function hideTermPill() {
  termPill.visible = false
}

function onTermPillResize() {
  termPill.visible = false
}

/* CTA 面板进场：复用全站 .reveal 约定（opacity + translateY + blur） */
let ctaObserver: IntersectionObserver | undefined

onMounted(() => {
  window.addEventListener('resize', onTermPillResize)
  const targets = document.querySelectorAll('.reveal-fade, .reveal')
  ctaObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        ctaObserver?.unobserve(entry.target)
      }
    }
  }, { threshold: 0.2 })
  targets.forEach((el) => ctaObserver?.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('resize', onTermPillResize)
  ctaObserver?.disconnect()
})

useHead({
  title: () => t('resources.metaTitle'),
  meta: [
    { name: 'description', content: () => t('resources.metaDescription') },
    { property: 'og:title', content: () => t('resources.metaTitle') },
    { property: 'og:description', content: () => t('resources.metaDescription') },
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
  <div class="rs-page">
    <AppHeader />
    <main>
      <section class="rs-hero">
        <div class="rs-hero-panel">
          <div class="rs-hero-inner">
            <div class="rs-hero-copy">
              <p class="rs-kicker reveal">{{ t('resources.kicker') }}</p>
              <h1 class="rs-hero-title reveal">{{ t('resources.heroTitle') }}</h1>
              <p class="rs-hero-sub reveal">{{ t('resources.heroSub') }}</p>
              <div class="rs-hero-actions reveal">
                <a class="rs-cta-button" href="/check">{{ t('resources.cta.button') }}<i aria-hidden="true">→</i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rs-types-panel">
        <div class="rs-inner">
          <h2 class="rs-title">{{ t('resources.types.title') }}</h2>
          <p class="rs-sub">{{ t('resources.types.sub') }}</p>
          <div class="rs-types">
            <article v-for="typeKey in IP_TYPES" :key="typeKey" class="rs-type-card">
              <div class="rs-type-media">
                <img :src="TYPE_IMAGES[typeKey]" :alt="t(`resources.types.${typeKey}.name`)" class="rs-type-img" loading="lazy" />
                <span class="rs-type-tag">{{ t(`resources.types.${typeKey}.tag`) }}</span>
              </div>
              <div class="rs-type-body">
                <h3>{{ t(`resources.types.${typeKey}.name`) }}</h3>
                <p class="rs-type-trait">{{ t(`resources.types.${typeKey}.trait`) }}</p>
                <p class="rs-type-label">{{ t('resources.types.bestFor') }}</p>
                <ul class="rs-type-uses">
                  <li v-for="n in 4" :key="n">{{ t(`resources.types.${typeKey}.use${n}`) }}</li>
                </ul>
                <p class="rs-type-risk">{{ t(`resources.types.${typeKey}.risk`) }}</p>
              </div>
            </article>
          </div>
          <p class="rs-types-note">{{ t('resources.types.note') }}</p>
        </div>
      </section>

      <section class="rs-section">
        <div class="rs-inner">
          <h2 class="rs-title">{{ t('resources.glossary.title') }}</h2>
          <p class="rs-sub">{{ t('resources.glossary.sub') }}</p>
          <div class="rs-glossary-wrap" @mouseleave="hideTermPill">
            <span
              class="rs-term-pill"
              :class="{ visible: termPill.visible, snap: termPill.snap }"
              :style="{ transform: `translate(${termPill.x}px, ${termPill.y}px)`, width: `${termPill.w}px`, height: `${termPill.h}px` }"
              aria-hidden="true"
            ></span>
            <dl class="rs-glossary">
              <div v-for="termKey in GLOSSARY_KEYS" :key="termKey" class="rs-term" @mouseenter="moveTermPill">
                <dt>{{ t(`resources.glossary.${termKey}.term`) }}</dt>
                <dd>{{ t(`resources.glossary.${termKey}.def`) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section class="rs-section rs-section-last">
        <div class="rs-inner">
          <div class="rs-cta reveal-fade">
            <div class="rs-cta-motion" aria-hidden="true">
              <video autoplay loop muted playsinline preload="metadata" src="/assets/gradient-green-square.mp4"></video>
              <div class="rs-cta-wash"></div>
            </div>
            <div class="rs-cta-inner">
              <div class="rs-cta-copy reveal">
                <h2 class="rs-cta-title">{{ t('resources.cta.title') }}</h2>
                <p class="rs-cta-sub">{{ t('resources.cta.sub') }}</p>
                <div class="rs-cta-actions">
                  <a class="rs-cta-btn rs-cta-btn-primary" href="/check">{{ t('resources.cta.button') }}<i aria-hidden="true">→</i></a>
                  <a class="rs-cta-btn rs-cta-btn-ghost" href="/batch-check">{{ t('resources.tools.batch.cta') }}</a>
                </div>
              </div>
              <div class="rs-cta-col reveal">
                <h3>{{ t('resources.tools.check.title') }}</h3>
                <p>{{ t('resources.tools.check.desc') }}</p>
                <a class="rs-cta-link" href="/check">{{ t('resources.tools.check.cta') }}<i aria-hidden="true">→</i></a>
              </div>
              <div class="rs-cta-col reveal">
                <h3>{{ t('resources.tools.batch.title') }}</h3>
                <p>{{ t('resources.tools.batch.desc') }}</p>
                <a class="rs-cta-link" href="/batch-check">{{ t('resources.tools.batch.cta') }}<i aria-hidden="true">→</i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.rs-page { background: #fff; }
.rs-inner { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
/* ————— Hero ————— */
/* ————— Hero（内嵌渐变视频圆角面板，参照 wrangle/startup） ————— */
.rs-hero { position: relative; padding: 16px 32px 0; background: #fff; }
/* 内容元素逐个进场：wrangle 同款 blur(4px)+translateY(20px)，面板背景不动 */
.rs-hero-copy .reveal { transform: translateY(20px); filter: blur(4px); }
.rs-hero-copy .reveal.visible { transform: translateY(0); filter: blur(0); }
.rs-hero-copy .reveal:nth-child(1) { transition-delay: 0ms; }
.rs-hero-copy .reveal:nth-child(2) { transition-delay: 120ms; }
.rs-hero-copy .reveal:nth-child(3) { transition-delay: 240ms; }
.rs-hero-copy .reveal:nth-child(4) { transition-delay: 360ms; }
.rs-hero-panel {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background:
    radial-gradient(52% 58% at 50% 60%, rgba(246, 214, 106, .75) 0%, rgba(246, 214, 106, 0) 100%),
    radial-gradient(38% 46% at 14% 92%, rgba(255, 183, 138, .5) 0%, rgba(255, 183, 138, 0) 100%),
    radial-gradient(40% 50% at 86% 90%, rgba(255, 204, 150, .48) 0%, rgba(255, 204, 150, 0) 100%),
    radial-gradient(64% 72% at 50% 112%, rgba(255, 238, 196, .95) 0%, rgba(255, 238, 196, 0) 100%),
    #fff;
}
.rs-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 440px;
  padding: 56px 32px 80px;
}
.rs-hero-copy { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 860px; }
.rs-hero-title {
  margin: 14px 0 0;
  color: var(--ink);
  font-family: Geist, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  font-size: 52px;
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -.035em;
  text-wrap: balance;
}
.rs-hero-sub { margin: 16px auto 0; max-width: 780px; color: var(--muted-ink); font-size: 16px; line-height: 1.6; text-wrap: pretty; }
.rs-hero-actions { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 24px; }
.rs-cta-button { margin-top: 0; }
.rs-cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(23, 23, 23, .14);
  border-radius: 10px;
  background: #fff;
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(23, 23, 23, .05);
  transition: background-color .2s ease, transform .2s ease;
}
.rs-cta-button:hover { background: #f6f6f6; }
.rs-cta-button:active { transform: scale(.97); }
.rs-cta-button i { font-style: normal; transition: transform .2s ease; }
.rs-cta-button:hover i { transform: translateX(3px); }

/* ————— Hero 视觉：生成图卡片 ————— */
/* ————— Section scaffolding ————— */
.rs-section { padding: 64px 0; }
.rs-section-last { padding-bottom: 96px; }
.rs-title {
  margin: 0;
  color: var(--ink);
  font-family: Geist, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  font-size: 38px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -.03em;
  text-wrap: balance;
}
.rs-sub { margin: 14px 0 0; max-width: 620px; color: var(--muted-ink); font-size: 15.5px; line-height: 1.6; text-wrap: pretty; }

/* ————— IP types（浅灰大圆角面板，白卡配图） ————— */
.rs-types-panel {
  width: calc(100% - 64px);
  margin: 24px 32px;
  padding: 64px 0;
  border-radius: 28px;
  background: var(--pale);
}
.rs-types { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; margin-top: 36px; }
.rs-type-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
}
.rs-type-media { position: relative; border-bottom: 1px solid var(--line); }
.rs-type-img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
.rs-type-tag {
  position: absolute;
  z-index: 1;
  top: 14px;
  right: 14px;
  padding: 5px 11px;
  border: 1px solid rgba(23, 23, 23, .08);
  border-radius: 999px;
  background: rgba(255, 255, 255, .92);
  color: var(--deep-green);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.rs-type-body { display: flex; flex: 1 1 auto; flex-direction: column; padding: 22px 24px 24px; }
.rs-type-body h3 { margin: 0; color: var(--ink); font-family: Geist, Inter, sans-serif; font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
.rs-type-trait { margin: 10px 0 0; color: var(--ink-soft); font-size: 14.5px; line-height: 1.55; }
.rs-type-label {
  margin: 18px 0 0;
  color: var(--muted-ink);
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.rs-type-uses { margin: 10px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.rs-type-uses li { position: relative; padding-left: 18px; color: var(--ink-soft); font-size: 14.5px; line-height: 1.5; }
.rs-type-uses li::before { content: "→"; position: absolute; left: 0; color: var(--deep-green); font-weight: 600; }
.rs-type-risk { margin: 18px 0 0; padding-top: 15px; border-top: 1px solid var(--line); color: var(--muted-ink); font-size: 13.5px; line-height: 1.55; }

.rs-types-note {
  margin: 28px 0 0;
  padding: 16px 22px;
  border-left: 3px solid var(--green);
  border-radius: 0 14px 14px 0;
  background: #fff;
  color: var(--ink-soft);
  font-size: 15px;
  line-height: 1.6;
}

/* ————— Guides ————— */
/* ————— Glossary ————— */
.rs-glossary-wrap { position: relative; margin-top: 28px; }
.rs-term-pill {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-radius: 10px;
  background: var(--pale);
  opacity: 0;
  pointer-events: none;
  transition: transform .5s cubic-bezier(.3, 1.35, .45, 1), width .5s cubic-bezier(.3, 1.35, .45, 1), height .5s cubic-bezier(.3, 1.35, .45, 1), opacity .25s ease;
}
.rs-term-pill.visible { opacity: 1; }
.rs-term-pill.snap { transition: opacity .25s ease; }
.rs-glossary { position: relative; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px 48px; }
.rs-term { position: relative; z-index: 1; }
.rs-term dt { color: var(--ink); font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
.rs-term dd { margin: 8px 0 0; color: var(--muted-ink); font-size: 14.5px; line-height: 1.6; }

/* ————— CTA（浅色渐变视频面板 · 左文右链接列，参照 wrangle 结尾模块） ————— */
.rs-cta {
  position: relative;
  min-height: 330px;
  overflow: hidden;
  border-radius: 32px;
  background: #f9fbf9;
}
.rs-cta-motion { position: absolute; inset: 0; overflow: hidden; }
.rs-cta-motion video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rs-cta-wash { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,.34) 55%, rgba(255,255,255,.48) 100%); }
.rs-cta-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.45fr .78fr .78fr;
  gap: 40px;
  align-items: center;
  min-height: 330px;
  padding: 56px;
}
.rs-cta-copy { max-width: 470px; padding-right: 24px; }
.rs-cta-title { margin: 0; color: var(--ink); font-family: Geist, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 38px; font-weight: 500; line-height: 1.12; letter-spacing: -.03em; text-wrap: balance; }
.rs-cta-sub { margin: 14px 0 0; max-width: 440px; color: var(--muted-ink); font-size: 15px; line-height: 1.6; text-wrap: pretty; }
.rs-cta-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 26px; }
.rs-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 42px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  transition: background-color .2s ease, border-color .2s ease, transform .2s ease;
}
.rs-cta-btn i { font-style: normal; transition: transform .2s ease; }
.rs-cta-btn-primary { background: var(--ink); border-color: var(--ink); color: #fff; }
.rs-cta-btn-primary:hover { background: #333; }
.rs-cta-btn-primary:hover i { transform: translateX(3px); }
.rs-cta-btn-primary:active { transform: scale(.97); }
.rs-cta-btn-ghost { background: rgba(255,255,255,.66); border-color: var(--line); color: var(--ink); }
.rs-cta-btn-ghost:hover { background: #fff; }
.rs-cta-col { border-left: 1px solid rgba(23, 23, 23, .12); padding-left: 28px; align-self: stretch; display: flex; flex-direction: column; justify-content: center; }
.rs-cta-col h3 { margin: 0; color: var(--ink); font-size: 15px; font-weight: 600; }
.rs-cta-col p { margin: 10px 0 18px; color: var(--muted-ink); font-size: 13.5px; line-height: 1.55; text-wrap: pretty; }
.rs-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  margin-left: -12px;
  border-radius: 8px;
  color: var(--ink);
  font-size: 13.5px;
  font-weight: 600;
  transition: background-color .2s ease;
}
.rs-cta-link i { font-style: normal; color: var(--deep-green); transition: transform .2s ease; }
.rs-cta-link:hover { background: rgba(255,255,255,.72); }
.rs-cta-link:hover i { transform: translateX(2px); }

/* 面板整体淡入，子块错开进场（延迟写在子元素上） */
.rs-cta.reveal-fade { opacity: 0; transition: opacity .68s cubic-bezier(.21,.47,.32,.98); }
.rs-cta.reveal-fade.visible { opacity: 1; }
.rs-cta-inner > .reveal:nth-child(1) { transition-delay: 100ms; }
.rs-cta-inner > .reveal:nth-child(2) { transition-delay: 220ms; }
.rs-cta-inner > .reveal:nth-child(3) { transition-delay: 340ms; }
@media (prefers-reduced-motion: reduce) {
  .rs-cta.reveal-fade { opacity: 1; }
  .rs-cta-inner > .reveal { transition-delay: 0ms; }
}

@media (max-width: 900px) {
  .rs-hero-inner { min-height: 340px; padding: 44px 24px 56px; }
  .rs-title { font-size: 30px; }
  .rs-types { grid-template-columns: 1fr; }
  .rs-section { padding: 48px 0; }
  .rs-types-panel { width: calc(100% - 32px); margin: 16px 16px; padding: 48px 0; }
  .rs-section-last { padding-bottom: 72px; }
  .rs-cta-inner { grid-template-columns: 1fr; gap: 32px; padding: 44px 28px; min-height: 0; }
  .rs-cta-col { border-left: 0; padding-left: 0; }
  .rs-cta-title { font-size: 30px; }
}
</style>
