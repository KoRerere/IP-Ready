<script setup lang="ts">
const { t } = useI18n()

const signals = [1, 2, 3, 4, 5] as const
const steps = [1, 2, 3, 4, 5, 6] as const
const faqs = [1, 2, 3, 4, 5] as const
const activeFaq = ref(0)

const page = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | undefined
const revealTimers: ReturnType<typeof setTimeout>[] = []

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

onMounted(() => {
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
        <div class="claude-wash" aria-hidden="true">
          <video autoplay loop muted playsinline preload="metadata" src="/assets/gradient-green-hero.mp4"></video>
          <div class="claude-wash-fade"></div>
        </div>

        <div class="claude-hero-copy">
          <h1 class="claude-h1 claude-enter">{{ t('claude.h1') }}</h1>
          <p class="claude-sub claude-enter" style="animation-delay: 70ms">{{ t('claude.sub') }}</p>
          <a class="claude-cta claude-enter" style="animation-delay: 140ms" href="/check">{{ t('claude.cta') }}</a>
          <ul class="claude-pills claude-enter" style="animation-delay: 210ms">
            <li>{{ t('claude.pill.free') }}</li>
            <li>{{ t('claude.pill.signals') }}</li>
            <li>{{ t('claude.pill.signup') }}</li>
          </ul>
        </div>

        <LandingDetector class="claude-enter" style="animation-delay: 280ms" />
      </section>

      <section class="claude-section claude-why" aria-labelledby="claude-why-title">
        <div class="claude-section-inner">
          <p class="claude-kicker claude-reveal">{{ t('claude.why.kicker') }}</p>
          <h2 id="claude-why-title" class="claude-h2 claude-reveal" data-reveal-delay="60">{{ t('claude.why.title') }}</h2>
          <p class="claude-lead claude-reveal" data-reveal-delay="120">{{ t('claude.why.sub') }}</p>
          <div class="claude-why-grid">
            <article
              v-for="(n, index) in signals"
              :key="n"
              class="claude-why-card claude-reveal"
              :data-reveal-delay="index * 70"
            >
              <span class="claude-why-num">{{ String(n).padStart(2, '0') }}</span>
              <div>
                <h3>{{ t(`claude.why.${n}.title`) }}</h3>
                <p>{{ t(`claude.why.${n}.body`) }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="claude-section claude-check" aria-labelledby="claude-check-title">
        <div class="claude-section-inner claude-narrow">
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
        <div class="claude-faq-inner">
          <h2 id="claude-faq-title" class="claude-h2 claude-reveal">{{ t('claude.faq.title') }}</h2>
          <div class="faq-list">
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

.claude-page :deep(.site-footer) {
  margin-top: 0;
}

.claude-hero {
  position: relative;
  padding: 56px 24px 96px;
  overflow: hidden;
}

.claude-wash {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  height: min(780px, 100%);
  pointer-events: none;
}

.claude-wash video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: .5;
}

.claude-wash-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,255,255,.9) 34%, rgba(255,255,255,.97) 72%, #fff 100%);
}

.claude-hero-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.claude-h1 {
  max-width: 14em;
  margin: 0;
  color: #171717;
  font-family: Geist, Inter, sans-serif;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-align: center;
  text-wrap: balance;
}

.claude-sub,
.claude-lead {
  max-width: 780px;
  margin: 20px 0 0;
  color: #404040;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
}

.claude-lead {
  max-width: 640px;
  margin-inline: auto;
  color: #7b7b7b;
}

.claude-cta {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  padding: 0 22px;
  border-radius: 8px;
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
  margin: 16px 0 0;
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
  background: rgba(255,255,255,.9);
  color: #404040;
  font-size: 13px;
  font-weight: 500;
}

.claude-enter {
  animation: platform-card-enter .48s cubic-bezier(.21,.47,.32,.98) both;
}

.claude-section {
  padding: 120px 24px;
}

.claude-section-inner {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.claude-narrow { width: min(760px, 100%); }

.claude-kicker {
  margin: 0;
  color: #12b84f;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-align: center;
}

.claude-h2 {
  max-width: 16em;
  margin: 12px auto 0;
  color: #171717;
  font-family: Geist, Inter, sans-serif;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: center;
  text-wrap: balance;
}

.claude-why-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-top: 64px;
}

.claude-why-card {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 22px 20px 24px;
  border: 1px solid #0000000f;
  border-radius: 12px;
  background: #f7f8f9;
  transition: border-color .35s cubic-bezier(.22,1,.36,1), background-color .35s cubic-bezier(.22,1,.36,1);
}

.claude-why-card:hover {
  border-color: rgba(18,184,79,.4);
  background: #fff;
}

.claude-why-num {
  color: #12b84f;
  font-family: Geist, Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .06em;
}

.claude-why-card h3 {
  margin: 0 0 8px;
  color: #171717;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.claude-why-card p {
  margin: 0;
  color: #404040;
  font-size: 14px;
  line-height: 1.5;
}

.claude-steps {
  margin: 48px 0 0;
  padding: 0;
  list-style: none;
}

.claude-steps li {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  padding: 18px 0;
  border-bottom: 1px solid #0000000f;
  color: #171717;
  font-size: 16px;
  line-height: 1.5;
}

.claude-steps li:first-child { border-top: 1px solid #0000000f; }

.claude-step-num {
  color: #12b84f;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 13px;
  font-weight: 700;
}

.claude-check-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
}

.claude-check-cta p {
  margin: 0;
  color: #404040;
  font-size: 15px;
  text-align: center;
}

.claude-faq {
  padding: 120px 24px;
  background: #f7f8f9;
}

.claude-faq-inner { width: min(760px, 100%); margin: 0 auto; }

.claude-bottom {
  padding: 112px 24px;
  background: #f0f6f2;
}

.claude-bottom-inner {
  display: flex;
  width: min(720px, 100%);
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

@media (max-width: 1100px) {
  .claude-why-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 900px) {
  .claude-hero { padding-top: 108px; }
  .claude-section,
  .claude-faq { padding-block: 80px; }
  .claude-bottom { padding-block: 80px; }
}

@media (max-width: 680px) {
  .claude-hero { padding-inline: 16px; }
  .claude-section,
  .claude-faq,
  .claude-bottom { padding-inline: 16px; }
  .claude-why-grid { grid-template-columns: 1fr; margin-top: 40px; }
  .claude-why-card { min-height: 0; }
  .claude-h1 { font-size: clamp(40px, 10vw, 48px); }
}

@media (prefers-reduced-motion: reduce) {
  .claude-enter { animation: none; }
  .claude-reveal { opacity: 1; transform: none; }
}
</style>
