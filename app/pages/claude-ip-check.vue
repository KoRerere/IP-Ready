<script setup lang="ts">
interface IpScanResult {
  ip: string
  country_code?: string
  city?: string
  risk_score?: number
}

const { locale, t } = useI18n()

const signals = [1, 2, 3, 4, 5] as const
const steps = [1, 2, 3, 4, 5, 6] as const
const faqs = [1, 2, 3, 4, 5] as const
const activeFaq = ref(0)

const scan = ref<IpScanResult | null>(null)
const scanFailed = ref(false)
const scanPending = ref(true)

const page = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | undefined
const revealTimers: ReturnType<typeof setTimeout>[] = []

const riskScore = computed(() => scan.value?.risk_score ?? 0)
const riskLevel = computed(() => (riskScore.value > 70 ? 'high' : riskScore.value >= 40 ? 'medium' : 'low'))
const riskLabel = computed(() => (riskLevel.value === 'high' ? t('risk.high') : riskLevel.value === 'medium' ? t('risk.medium') : t('risk.low')))
const regionLabel = computed(() => {
  const code = scan.value?.country_code
  if (!code) return ''
  const country = new Intl.DisplayNames([locale.value === 'zh' ? 'zh-CN' : 'en'], { type: 'region' }).of(code) || code
  return scan.value?.city ? `${country} · ${scan.value.city}` : country
})

useSiteSeo({
  title: () => t('claude.metaTitle'),
  description: () => t('claude.metaDescription'),
  path: '/claude-ip-check',
})

const faqJsonLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((index) => ({
    '@type': 'Question',
    name: t(`claude.faq.${index}.q`),
    acceptedAnswer: {
      '@type': 'Answer',
      text: t(`claude.faq.${index}.a`),
    },
  })),
}))

useHead({
  script: [
    {
      key: 'claude-faq-jsonld',
      type: 'application/ld+json',
      innerHTML: faqJsonLd,
    },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap',
    },
  ],
})

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? -1 : index
}

async function loadGlance() {
  scanPending.value = true
  scanFailed.value = false
  try {
    const result = await $fetch<IpScanResult>('/api/ip-check')
    if (!result?.ip) {
      scanFailed.value = true
      scan.value = null
      return
    }
    scan.value = result
  } catch {
    scan.value = null
    scanFailed.value = true
  } finally {
    scanPending.value = false
  }
}

onMounted(() => {
  void loadGlance()
  const root = page.value
  if (!root) return
  const nodes = root.querySelectorAll<HTMLElement>('.claude-reveal')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((node) => node.classList.add('visible'))
    return
  }
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const delay = Number((entry.target as HTMLElement).dataset.revealDelay ?? 0)
      const timer = setTimeout(() => entry.target.classList.add('visible'), delay)
      revealTimers.push(timer)
      revealObserver?.unobserve(entry.target)
    }
  }, { threshold: 0.16, rootMargin: '0px 0px -32px 0px' })
  nodes.forEach((node) => revealObserver?.observe(node))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  revealTimers.forEach(clearTimeout)
})
</script>

<template>
  <div ref="page" class="claude-page">
    <AppHeader />
    <main>
      <section class="claude-hero">
        <div class="claude-blob" aria-hidden="true"></div>
        <div class="claude-hero-copy">
          <p class="claude-kicker claude-enter">{{ t('claude.kicker') }}</p>
          <h1 class="claude-h1 claude-enter" style="animation-delay: 60ms">{{ t('claude.h1') }}</h1>
          <p class="claude-sub claude-enter" style="animation-delay: 120ms">{{ t('claude.sub') }}</p>
          <a class="claude-cta claude-enter" style="animation-delay: 180ms" href="/check">{{ t('claude.cta') }}</a>
          <ul class="claude-pills claude-enter" style="animation-delay: 240ms">
            <li>{{ t('claude.pill.free') }}</li>
            <li>{{ t('claude.pill.signals') }}</li>
            <li>{{ t('claude.pill.signup') }}</li>
          </ul>
          <a class="claude-ghost claude-enter" style="animation-delay: 300ms" href="#why">{{ t('claude.whyLink') }}</a>
        </div>
      </section>

      <section class="claude-glance" aria-label="Network glance">
        <a v-if="scanFailed" class="claude-cta claude-glance-open" href="/check">{{ t('claude.glance.open') }}</a>
        <div v-else class="claude-glance-card" :class="{ 'is-pending': scanPending }" :aria-busy="scanPending">
          <div class="claude-glance-id">
            <strong>{{ scan?.ip || '…' }}</strong>
            <span>{{ regionLabel || '…' }}</span>
          </div>
          <div class="claude-glance-actions">
            <em v-if="scan" class="claude-risk" :class="riskLevel">{{ riskLabel }}</em>
            <a href="/check">{{ t('claude.glance.report') }}</a>
          </div>
        </div>
      </section>

      <section id="why" class="claude-section" aria-labelledby="claude-why-title">
        <div class="claude-measure">
          <p class="claude-kicker claude-reveal">{{ t('claude.why.kicker') }}</p>
          <h2 id="claude-why-title" class="claude-h2 claude-reveal" data-reveal-delay="60">{{ t('claude.why.title') }}</h2>
          <p class="claude-lead claude-reveal" data-reveal-delay="120">{{ t('claude.why.sub') }}</p>
          <ol class="claude-why-list">
            <li
              v-for="(n, index) in signals"
              :key="n"
              class="claude-reveal"
              :data-reveal-delay="index * 70"
            >
              <span class="claude-why-num">{{ String(n).padStart(2, '0') }}</span>
              <div>
                <h3>{{ t(`claude.why.${n}.title`) }}</h3>
                <p>{{ t(`claude.why.${n}.body`) }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="claude-section claude-check" aria-labelledby="claude-check-title">
        <div class="claude-measure">
          <p class="claude-kicker claude-reveal">{{ t('claude.check.kicker') }}</p>
          <h2 id="claude-check-title" class="claude-h2 claude-reveal" data-reveal-delay="60">{{ t('claude.check.title') }}</h2>
          <p class="claude-lead claude-reveal" data-reveal-delay="120">{{ t('claude.check.sub') }}</p>
          <ol class="claude-steps">
            <li v-for="(n, index) in steps" :key="n" class="claude-reveal" :data-reveal-delay="index * 40">
              <span class="claude-step-num">{{ String(n).padStart(2, '0') }}</span>
              <span>{{ t(`claude.step.${n}`) }}</span>
            </li>
          </ol>
          <div class="claude-check-cta claude-reveal">
            <p>{{ t('claude.check.ctaLead') }}</p>
            <a class="claude-cta" href="/check">{{ t('claude.cta') }}</a>
          </div>
        </div>
      </section>

      <section class="claude-faq" aria-labelledby="claude-faq-title">
        <div class="claude-measure">
          <h2 id="claude-faq-title" class="claude-h2 claude-reveal">{{ t('claude.faq.title') }}</h2>
          <div class="faq-list claude-faq-list">
            <article
              v-for="(n, index) in faqs"
              :key="n"
              class="faq-item claude-reveal"
              :class="{ active: activeFaq === index }"
              :data-reveal-delay="index * 40"
            >
              <button type="button" :aria-expanded="activeFaq === index" :aria-controls="`claude-faq-${n}`" @click="toggleFaq(index)">
                <span>{{ t(`claude.faq.${n}.q`) }}</span>
                <CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" />
              </button>
              <div :id="`claude-faq-${n}`" class="faq-answer" role="region">
                <p>{{ t(`claude.faq.${n}.a`) }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="claude-bottom">
        <div class="claude-bottom-inner claude-reveal">
          <h2 class="claude-h2">{{ t('claude.bottom.title') }}</h2>
          <p class="claude-lead">{{ t('claude.bottom.sub') }}</p>
          <a class="claude-cta" href="/check">{{ t('claude.cta') }}</a>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.claude-page {
  background: #fff;
  color: #171717;
}

.claude-page :deep(.site-footer) { margin-top: 0; }

.claude-hero {
  position: relative;
  display: flex;
  min-height: calc(100svh - 64px);
  align-items: center;
  justify-content: center;
  padding: 72px 24px 96px;
  overflow: hidden;
}

.claude-blob {
  position: absolute;
  top: 8%;
  left: 50%;
  width: min(640px, 80vw);
  height: min(640px, 80vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 201, 77, .16) 0%, rgba(29, 201, 77, 0) 68%);
  filter: blur(8px);
  pointer-events: none;
  transform: translateX(-50%);
}

.claude-hero-copy {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(920px, 100%);
  flex-direction: column;
  align-items: center;
}

.claude-kicker {
  margin: 0;
  color: #12b84f;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .08em;
  text-align: center;
  text-transform: none;
}

.claude-h1 {
  max-width: 12em;
  margin: 18px 0 0;
  color: #171717;
  font-family: Geist, Inter, sans-serif;
  font-size: clamp(48px, 6.4vw, 72px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.02;
  text-align: center;
  text-wrap: balance;
}

.claude-sub {
  max-width: 36rem;
  margin: 22px 0 0;
  color: #404040;
  font-size: 18px;
  line-height: 1.45;
  text-align: center;
}

.claude-lead {
  max-width: 36rem;
  margin: 18px auto 0;
  color: #7b7b7b;
  font-size: 17px;
  line-height: 1.55;
  text-align: center;
}

.claude-cta {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  padding: 0 26px;
  border-radius: 999px;
  background: #12b84f;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transition: background-color .35s cubic-bezier(.22,1,.36,1), transform .2s cubic-bezier(.3,1.35,.45,1);
}

.claude-cta:hover { background: #0ea344; }
.claude-cta:active { transform: scale(.98); }
.claude-cta:focus-visible { outline: 2px solid #087a32; outline-offset: 3px; }

.claude-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.claude-pills li {
  display: inline-flex;
  height: 32px;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #0000000f;
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  color: #404040;
  font-size: 13px;
  font-weight: 500;
}

.claude-ghost {
  margin-top: 22px;
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 500;
  transition: color .35s cubic-bezier(.22,1,.36,1);
}

.claude-ghost:hover { color: #087a32; }
.claude-ghost:focus-visible { outline: 2px solid #087a32; outline-offset: 3px; border-radius: 4px; }

.claude-enter {
  animation: platform-card-enter .48s cubic-bezier(.21,.47,.32,.98) both;
}

.claude-glance {
  display: flex;
  justify-content: center;
  padding: 0 24px 48px;
}

.claude-glance-card {
  display: flex;
  width: min(760px, 100%);
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  border-radius: 18px;
  background: #f7f8f9;
}

.claude-glance-card.is-pending { color: #7b7b7b; }

.claude-glance-id {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.claude-glance-id strong {
  color: #171717;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.claude-glance-id span {
  color: #7b7b7b;
  font-size: 14px;
}

.claude-glance-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 18px;
}

.claude-risk {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff;
  color: #087a32;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
}

.claude-risk.medium { background: #fbded0; color: #c2410c; }
.claude-risk.high { background: #fee2e2; color: #b91c1c; }

.claude-glance-actions a {
  color: #087a32;
  font-size: 14px;
  font-weight: 600;
  transition: color .35s cubic-bezier(.22,1,.36,1);
}

.claude-glance-actions a:hover { color: #12b84f; }

.claude-glance-open { margin-top: 0; }

.claude-section { padding: 160px 24px; }

.claude-measure {
  width: min(720px, 100%);
  margin: 0 auto;
}

.claude-h2 {
  max-width: 14em;
  margin: 14px auto 0;
  color: #171717;
  font-family: Geist, Inter, sans-serif;
  font-size: clamp(36px, 4.4vw, 52px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.08;
  text-align: center;
  text-wrap: balance;
}

.claude-why-list,
.claude-steps {
  margin: 72px 0 0;
  padding: 0;
  list-style: none;
}

.claude-why-list { display: flex; flex-direction: column; gap: 36px; }

.claude-why-list li {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 28px;
  align-items: baseline;
}

.claude-why-num {
  color: #12b84f;
  font-family: Geist, Inter, sans-serif;
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: .9;
}

.claude-why-list h3 {
  margin: 0;
  color: #171717;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.claude-why-list p {
  margin: 8px 0 0;
  color: #404040;
  font-size: 16px;
  line-height: 1.5;
}

.claude-steps li {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 16px;
  align-items: baseline;
  padding: 22px 0;
  color: #171717;
  font-size: 17px;
  line-height: 1.5;
}

.claude-step-num {
  color: #12b84f;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 15px;
  font-weight: 700;
}

.claude-check-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
}

.claude-check-cta p {
  margin: 0;
  color: #404040;
  font-size: 16px;
  text-align: center;
}

.claude-faq {
  padding: 160px 24px;
  background: #f7f8f9;
}

.claude-faq-list { margin-top: 48px; }

.claude-bottom {
  padding: 160px 24px;
  background: #f0f6f2;
}

.claude-bottom-inner {
  display: flex;
  width: min(640px, 100%);
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.claude-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .52s cubic-bezier(.21,.47,.32,.98), transform .52s cubic-bezier(.21,.47,.32,.98);
}

.claude-reveal.visible {
  opacity: 1;
  transform: none;
}

#why { scroll-margin-top: 96px; }

@media (max-width: 900px) {
  .claude-hero {
    min-height: 0;
    align-items: flex-start;
    padding: 112px 20px 64px;
  }
  .claude-section,
  .claude-faq,
  .claude-bottom { padding-block: 96px; }
  .claude-why-list { gap: 28px; margin-top: 48px; }
}

@media (max-width: 680px) {
  .claude-hero,
  .claude-glance,
  .claude-section,
  .claude-faq,
  .claude-bottom { padding-inline: 16px; }
  .claude-h1 { font-size: clamp(48px, 12vw, 56px); }
  .claude-glance-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    border-radius: 16px;
  }
  .claude-why-list li {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 16px;
  }
  .claude-why-num { font-size: 32px; }
  .claude-why-list h3 { font-size: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .claude-enter { animation: none; }
  .claude-reveal,
  .claude-blob { opacity: 1; transform: none; }
  .claude-blob { transform: translateX(-50%); }
}
</style>
