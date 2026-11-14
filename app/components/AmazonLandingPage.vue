<script setup lang="ts">
import { amazonLanding } from '~/data/amazon-landing'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

const AMAZON_ICON = '/assets/icons/platform/IP_ic_Amazon.svg'
const ARROW_ICON = '/assets/figma/imgVector29.svg'

const { locale } = useI18n()
const copy = computed(() => amazonLanding[locale.value === 'zh' ? 'zh' : 'en'])
const openFaq = ref<number | null>(0)
const activeNetwork = ref(0)
const networkType = ref<'a' | 'b'>('a')

const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: copy.value.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}))

const social = computed(() => siteSocialMeta({
  path: '/amazon-ip-check',
  title: copy.value.title,
  description: copy.value.description,
}))
useHead(() => ({
  title: copy.value.title,
  meta: [
    { name: 'description', content: copy.value.description },
    ...social.value.meta,
  ],
  script: [{ key: 'landing-faq-jsonld', type: 'application/ld+json' as 'application/json', innerHTML: JSON.stringify(faqJsonLd.value) }],
  link: [
    ...social.value.link,
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap' },
  ],
}))

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}
function scoreTone(score: number) {
  return score <= 30 ? 'low' : score <= 60 ? 'mid' : 'high'
}
</script>

<template>
  <div class="az-page">
    <AppHeader />
    <main id="top" class="az-rail">
      <!-- Hero -->
      <section class="az-hero">
        <div class="az-hero-copy">
          <p class="az-eyebrow az-eyebrow--icon"><img :src="AMAZON_ICON" alt="" />{{ copy.hero.eyebrow }}</p>
          <h1>{{ copy.hero.h1a }}<br />{{ copy.hero.h1b }}</h1>
          <p class="az-hero-sub">{{ copy.hero.sub }}</p>
          <Button as="a" href="#scan" size="lg" class="az-btn az-btn--dark">{{ copy.hero.cta }}</Button>
        </div>
        <div class="az-hero-visual">
          <span class="az-hero-glyph" aria-hidden="true">IP</span>
          <Button as="a" href="#scan" variant="outline" class="az-hero-pill">
            <span class="az-play" aria-hidden="true"><CurrentIcon :src="ARROW_ICON" /></span>{{ copy.hero.pill }}
          </Button>
        </div>
      </section>

      <!-- Live check -->
      <section id="scan" class="az-section">
        <div class="az-head">
          <div>
            <p class="az-eyebrow">{{ copy.live.eyebrow }}</p>
            <h2>{{ copy.live.h2a }}<br /><span>{{ copy.live.h2b }}</span></h2>
          </div>
          <p class="az-head-desc">{{ copy.live.desc }}</p>
        </div>
        <div class="az-frame">
          <AmazonDetectorCard :copy="copy.detector" />
        </div>
        <div class="az-grid">
          <h3 class="az-grid-title">{{ copy.reads.title }}</h3>
          <article v-for="item in copy.reads.items" :key="item.title" class="az-grid-item">
            <h4>{{ item.title }}</h4>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <!-- Why Amazon flags your IP -->
      <section id="why" class="az-section">
        <div class="az-head">
          <div>
            <p class="az-eyebrow">{{ copy.why.eyebrow }}</p>
            <h2>{{ copy.why.h2a }}<br /><span>{{ copy.why.h2b }}</span></h2>
            <Button as="a" :href="copy.why.ctaHref" variant="outline" size="lg" class="az-btn az-btn--light az-head-cta">{{ copy.why.cta }}</Button>
          </div>
          <p class="az-head-desc">{{ copy.why.desc }}</p>
        </div>
        <div class="az-cards az-cards--wide">
          <article class="az-card az-card--map">
            <div class="az-map">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="20" y1="24" x2="50" y2="50" />
                <line x1="20" y1="76" x2="50" y2="50" />
                <line class="bad" x1="80" y1="50" x2="50" y2="50" />
              </svg>
              <div class="az-map-node az-map-node--you"><i></i>{{ copy.why.mapYou }}</div>
              <div class="az-map-node az-map-node--other"><i></i>{{ copy.why.mapOther }}</div>
              <div class="az-map-node az-map-node--bad"><i></i>{{ copy.why.mapSuspended }}<Badge variant="outline" class="az-map-tag">{{ copy.why.mapSuspendedTag }}</Badge></div>
              <div class="az-map-ip"><span>{{ copy.why.mapLabel }}</span><b>{{ copy.why.mapIp }}</b></div>
            </div>
            <div class="az-card-caption">
              <h3>{{ copy.why.mapTitle }}</h3>
              <p>{{ copy.why.mapBody }}</p>
            </div>
          </article>
          <article class="az-card az-card--side">
            <ul class="az-rows">
              <li v-for="row in copy.why.rows" :key="row.k"><b>{{ row.k }}</b><span aria-hidden="true">→</span><em>{{ row.v }}</em></li>
            </ul>
            <div class="az-card-caption az-card-caption--center">
              <h3>{{ copy.why.sideTitle }}</h3>
              <p>{{ copy.why.sideBody }}</p>
            </div>
          </article>
        </div>
        <div class="az-grid">
          <h3 class="az-grid-title">{{ copy.why.gridTitle }}</h3>
          <article v-for="item in copy.why.items" :key="item.title" class="az-grid-item">
            <h4>{{ item.title }}</h4>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <!-- Statement -->
      <section class="az-section az-statement">
        <div>
          <h2>{{ copy.statement.h2 }}</h2>
          <p>{{ copy.statement.body }}</p>
        </div>
        <div class="az-orb" aria-hidden="true"><span></span></div>
      </section>
    </main>

    <!-- Who shares your connection -->
    <section class="az-dark">
      <div class="az-dark-inner">
        <div class="az-tile az-tile--1" aria-hidden="true"></div>
        <div class="az-tile az-tile--2" aria-hidden="true"></div>
        <div class="az-tile az-tile--3" aria-hidden="true"></div>
        <div class="az-tile az-tile--4" aria-hidden="true"></div>
        <div class="az-dark-center">
          <p class="az-dark-eyebrow">{{ copy.networks.eyebrow }}</p>
          <ul class="az-network-list">
            <li v-for="(item, index) in copy.networks.items" :key="item.name">
              <button type="button" :class="{ active: activeNetwork === index }" :aria-pressed="activeNetwork === index" @mouseenter="activeNetwork = index" @focus="activeNetwork = index" @click="activeNetwork = index">{{ item.name }}</button>
            </li>
          </ul>
          <p class="az-network-body"><b>{{ copy.networks.items[activeNetwork]?.name }}</b> {{ copy.networks.items[activeNetwork]?.body }}</p>
          <div class="az-dark-actions">
            <Button as="a" href="#scan" variant="secondary" class="az-btn az-btn--glass">{{ copy.networks.cta1 }}</Button>
            <Button as="a" :href="copy.networks.cta2Href" variant="secondary" class="az-btn az-btn--glass">{{ copy.networks.cta2 }}</Button>
          </div>
        </div>
      </div>
    </section>

    <main class="az-rail">
      <!-- Quote -->
      <section class="az-section az-quote">
        <blockquote>{{ copy.quote.text }}</blockquote>
        <p>{{ copy.quote.source }}</p>
      </section>

      <!-- Report -->
      <section class="az-section">
        <div class="az-head">
          <div><h2>{{ copy.report.h2a }}<br /><span>{{ copy.report.h2b }}</span></h2></div>
          <p class="az-head-desc">{{ copy.report.desc }}</p>
        </div>
        <div class="az-cards az-cards--three">
          <article class="az-feature">
            <div class="az-feature-visual az-feature-visual--gradient" :class="{ alt: networkType === 'b' }">
              <div class="az-toggle" role="group">
                <button type="button" :class="{ active: networkType === 'a' }" :aria-pressed="networkType === 'a'" @click="networkType = 'a'">{{ copy.report.toggleA }}</button>
                <button type="button" :class="{ active: networkType === 'b' }" :aria-pressed="networkType === 'b'" @click="networkType = 'b'">{{ copy.report.toggleB }}</button>
              </div>
            </div>
            <h3>{{ copy.report.cards[0]?.title }}</h3>
            <p>{{ copy.report.cards[0]?.body }}</p>
          </article>
          <article class="az-feature">
            <div class="az-feature-visual az-feature-visual--text">
              <p><template v-for="(part, index) in copy.report.sentence" :key="index"><span :class="{ accent: part.accent }">{{ part.text }}</span></template></p>
            </div>
            <h3>{{ copy.report.cards[1]?.title }}</h3>
            <p>{{ copy.report.cards[1]?.body }}</p>
          </article>
          <article class="az-feature">
            <div class="az-feature-visual az-feature-visual--rows">
              <ul class="az-rows">
                <li v-for="flag in copy.report.flags" :key="flag.k"><b>{{ flag.k }}</b><span aria-hidden="true">→</span><em :class="{ bad: flag.bad }">{{ flag.v }}</em><i :class="{ bad: flag.bad }" aria-hidden="true"></i></li>
              </ul>
            </div>
            <h3>{{ copy.report.cards[2]?.title }}</h3>
            <p>{{ copy.report.cards[2]?.body }}</p>
          </article>
        </div>
      </section>

      <!-- Checklist -->
      <section id="checklist" class="az-section">
        <h2 class="az-center-title">{{ copy.checklist.h2a }}<br /><span>{{ copy.checklist.h2b }}</span></h2>
        <div class="az-cards az-cards--three">
          <article v-for="(card, index) in copy.checklist.cards" :key="card.title" class="az-plan" :class="{ featured: index === 0 }">
            <h3>{{ card.title }}</h3>
            <p class="az-plan-sub">{{ card.sub }}</p>
            <Button as="a" :href="card.href" :variant="index === 0 ? 'default' : 'outline'" class="az-btn az-plan-cta" :class="index === 0 ? 'az-btn--dark' : 'az-btn--light'">{{ card.cta }}</Button>
            <p class="az-plan-list-title">{{ card.listTitle }}</p>
            <ul>
              <li v-for="item in card.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </section>

      <!-- Batch check -->
      <section class="az-section">
        <div class="az-head">
          <div><h2>{{ copy.batch.h2a }}<br /><span>{{ copy.batch.h2b }}</span></h2></div>
          <p class="az-head-desc">{{ copy.batch.desc }}</p>
        </div>
        <div class="az-batch">
          <div class="az-batch-copy">
            <h3>{{ copy.batch.cardTitle }}</h3>
            <p>{{ copy.batch.cardBody }}</p>
            <ul>
              <li v-for="item in copy.batch.bullets" :key="item">{{ item }}</li>
            </ul>
            <Button as="a" href="/batch-check" variant="outline" size="lg" class="az-btn az-btn--light">{{ copy.batch.cta }}</Button>
          </div>
          <div class="az-batch-visual">
            <div class="az-batch-panel">
              <p class="az-batch-label">{{ copy.batch.sample }}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead v-for="col in copy.batch.cols" :key="col">{{ col }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="row in copy.batch.rows" :key="row.ip">
                    <TableCell class="az-mono">{{ row.ip }}</TableCell>
                    <TableCell>{{ row.type }}</TableCell>
                    <TableCell><span class="az-score" :class="'az-score--' + scoreTone(row.score)">{{ row.score }}</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="az-section az-faq">
        <h2>{{ copy.faq.h2a }}<br />{{ copy.faq.h2b }}</h2>
        <div class="az-faq-list">
          <article v-for="(item, index) in copy.faq.items" :key="item.question" class="az-faq-item" :class="{ active: openFaq === index }">
            <button type="button" :aria-expanded="openFaq === index" @click="toggleFaq(index)"><span>{{ item.question }}</span><span class="az-faq-chevron" aria-hidden="true"></span></button>
            <div class="az-faq-answer"><p>{{ item.answer }}</p></div>
          </article>
        </div>
      </section>

      <!-- Keep reading -->
      <section class="az-section az-section--tight">
        <div class="az-grid az-grid--links">
          <h3 class="az-grid-title">{{ copy.links.title }}</h3>
          <a v-for="link in copy.links.items" :key="link.href + link.label" :href="link.href" class="az-link"><span>{{ link.label }}</span><span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="az-final">
        <h2>{{ copy.final.h2 }}</h2>
        <Button as="a" href="#scan" size="lg" class="az-btn az-btn--dark">{{ copy.final.cta }}</Button>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.az-page {
  --az-bg: #fdfcfc;
  --az-ink: #0a0a0a;
  --az-muted: #777169;
  --az-body: #59544f;
  --az-card: #f5f3f1;
  --az-line: #ebe8e4;
  --az-dark: #1c1917;
  --az-accent: #e8742c;
  min-height: 100vh;
  background: var(--az-bg);
  color: var(--az-ink);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}
.az-rail { width: min(1152px, calc(100% - 48px)); margin: 0 auto; border-inline: 1px solid var(--az-line); }
.az-section { padding: 112px 32px; border-top: 1px solid var(--az-line); scroll-margin-top: 64px; }
.az-section--tight { padding-block: 72px; }

/* Shared type */
.az-eyebrow { margin: 0 0 14px; color: var(--az-muted); font-size: 15px; font-weight: 500; line-height: 22px; }
.az-eyebrow--icon { display: inline-flex; align-items: center; gap: 8px; }
.az-eyebrow--icon img { width: 20px; height: 20px; object-fit: contain; }
.az-page h1, .az-page h2 { margin: 0; color: #171717; font-weight: 600; letter-spacing: 0; text-wrap: balance; }
.az-page h2 { font-size: 38px; line-height: 1.1; }
.az-page h2 span { color: #a59f97; }
.az-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: end; }
.az-head-desc { max-width: 460px; margin: 0; color: var(--az-body); font-size: 15px; line-height: 1.7; }
.az-head-cta { margin-top: 24px; }

/* Buttons: project Button, pill-shaped for this page */
.az-btn { height: 44px; padding-inline: 20px; border-radius: 999px; font-size: 14px; font-weight: 500; }
.az-btn--dark { background: #000; color: #fff; }
.az-btn--dark:hover { background: #2a2623; color: #fff; }
.az-btn--light { border: 1px solid var(--az-line); background: #fff; color: #000; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
.az-btn--light:hover { background: var(--az-card); color: #000; }
.az-btn--glass { height: 36px; padding-inline: 16px; background: rgba(255,255,255,.14); color: #fff; font-size: 13px; }
.az-btn--glass:hover { background: rgba(255,255,255,.24); color: #fff; }

/* Hero */
/* hero sits over the rail's side lines so they only start below it */
.az-hero { position: relative; margin-inline: -1px; background: var(--az-bg); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 32px; align-items: center; min-height: 640px; padding: 72px 32px; }
.az-hero h1 { font-size: clamp(32px, 4.2vw, 44px); line-height: 1.2; }
.az-hero-sub { max-width: 420px; margin: 16px 0 28px; color: var(--az-muted); font-size: 14.5px; line-height: 1.5; }
.az-hero-visual { position: relative; display: grid; min-height: 420px; place-items: center; }
.az-hero-glyph {
  font-size: clamp(220px, 30vw, 400px); font-style: italic; font-weight: 700; letter-spacing: -.06em; line-height: 1;
  background: linear-gradient(115deg, #17231b 8%, #2f8f5b 30%, #f2a14a 52%, #e8532c 74%, #1c1917 96%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: blur(7px); user-select: none;
}
.az-hero-pill { position: absolute; top: 50%; left: 50%; height: 60px; gap: 14px; padding: 0 28px 0 12px; transform: translate(-50%, -50%); border: 0; border-radius: 999px; background: #fff; color: #000; box-shadow: 0 10px 40px rgba(28,25,23,.14), 0 1px 2px rgba(0,0,0,.06); font-size: 16px; font-weight: 500; }
.az-hero-pill:hover { background: #fff; color: #000; box-shadow: 0 14px 48px rgba(28,25,23,.2); }
.az-play { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: #000; color: #fff; }
.az-play :deep(.current-icon) { width: 14px; height: 14px; }

/* Detector frame */
.az-frame { margin-top: 40px; }

/* Title + 2x2 grid */
.az-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px 48px; margin-top: 56px; }
.az-grid-title { grid-row: span 2; margin: 0; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-grid-item h4 { margin: 0 0 8px; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-grid-item p { margin: 0; color: var(--az-muted); font-size: 14px; line-height: 1.55; }
.az-grid--links { margin-top: 0; gap: 0 48px; }
.az-link { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--az-line); color: var(--az-ink); font-size: 17px; font-weight: 500; line-height: 1.5; transition: color .15s; }
.az-link:hover { color: var(--az-accent); }

/* Cards */
.az-cards { display: grid; gap: 8px; margin-top: 40px; }
.az-cards--wide { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
.az-cards--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.az-card { display: flex; min-height: 440px; flex-direction: column; overflow: hidden; border-radius: 20px; background: var(--az-card); }
.az-card-caption { padding: 0 28px 28px; }
.az-card-caption--center { text-align: center; }
.az-card-caption h3 { margin: 0 0 6px; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-card-caption p { margin: 0; color: var(--az-muted); font-size: 14px; line-height: 1.55; }

.az-map { position: relative; flex: 1; min-height: 300px; margin: 12px; }
.az-map svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.az-map line { stroke: #cfc9c1; stroke-width: 1.5; stroke-dasharray: 5 5; vector-effect: non-scaling-stroke; }
.az-map line.bad { stroke: #e8532c; }
.az-map-node { position: absolute; display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; transform: translate(-50%, -50%); border-radius: 999px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px rgba(28,25,23,.06); font-size: 14px; line-height: 20px; white-space: nowrap; }
.az-map-node i { width: 8px; height: 8px; border-radius: 50%; background: #2f8f5b; }
.az-map-node--you { top: 24%; left: 20%; }
.az-map-node--other { top: 76%; left: 20%; }
.az-map-node--other i { background: #b8b1a8; }
.az-map-node--bad { top: 50%; left: 80%; }
.az-map-node--bad i { background: #e8532c; }
.az-map-tag { border-color: #f3c3b3; background: #fff1ec; color: #b23d2c; font-weight: 500; }
.az-map-ip { position: absolute; top: 50%; left: 50%; display: grid; gap: 2px; padding: 14px 20px; transform: translate(-50%, -50%); border-radius: 16px; background: #000; color: #fff; text-align: center; box-shadow: 0 16px 40px rgba(28,25,23,.25); }
.az-map-ip span { color: rgba(255,255,255,.6); font-size: 12px; line-height: 16px; }
.az-map-ip b { font-family: "JetBrains Mono", monospace; font-size: 15px; font-weight: 700; line-height: 22px; }

.az-rows { display: grid; margin: 0; padding: 0; list-style: none; }
.az-card--side .az-rows { flex: 1; align-content: center; padding: 20px 28px; }
.az-rows li { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(28,25,23,.08); font-size: 14px; line-height: 20px; }
.az-rows li:last-child { border-bottom: 0; }
.az-rows b { font-weight: 500; white-space: nowrap; }
.az-rows span { color: #b8b1a8; }
.az-rows em { color: var(--az-muted); font-style: normal; }
.az-rows em.bad { color: #b23d2c; }
.az-rows i { width: 8px; height: 8px; margin-left: auto; border-radius: 50%; background: #2f8f5b; }
.az-rows i.bad { background: #e8532c; }

/* Statement */
.az-statement { display: grid; grid-template-columns: minmax(0, 320px) 240px; gap: 96px; align-items: center; justify-content: center; padding-block: 140px; }
.az-statement p { margin: 16px 0 0; color: var(--az-body); font-size: 15px; line-height: 1.7; }
.az-orb { position: relative; width: 240px; height: 240px; overflow: hidden; border-radius: 50%; background: #17231b; }
.az-orb span { position: absolute; inset: -30%; background: conic-gradient(from 200deg at 45% 55%, #f2a14a, #ffe1bd, #2f8f5b, #17231b, #e8532c, #f2a14a); filter: blur(26px); animation: az-spin 18s linear infinite; }
@keyframes az-spin { to { transform: rotate(360deg); } }

/* Dark network section */
.az-dark { background: var(--az-dark); color: #fff; }
.az-dark-inner { position: relative; width: min(1152px, calc(100% - 48px)); min-height: 760px; margin: 0 auto; padding: 120px 32px; }
.az-dark-center { position: relative; z-index: 1; max-width: 360px; margin: 0 auto; text-align: center; }
.az-dark-eyebrow { margin: 0 0 18px; color: rgba(255,255,255,.6); font-size: 14px; line-height: 20px; }
.az-network-list { margin: 0; padding: 0; list-style: none; }
.az-network-list button { padding: 2px 8px; border: 0; background: none; color: rgba(255,255,255,.38); font: inherit; font-size: 24px; font-weight: 500; line-height: 1.55; cursor: pointer; transition: color .2s; }
.az-network-list button.active, .az-network-list button:focus-visible { color: #fff; outline: none; }
.az-network-body { min-height: 96px; margin: 40px 0 0; color: rgba(255,255,255,.62); font-size: 14px; line-height: 1.6; }
.az-network-body b { color: #fff; font-weight: 500; }
.az-dark-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 20px; }
.az-tile { position: absolute; border-radius: 6px; }
.az-tile--1 { top: 56px; left: 0; width: 200px; height: 290px; background: linear-gradient(160deg, #23405c, #6fa3c7 45%, #e9eef0 70%, #2f5373); }
.az-tile--2 { top: 72px; right: 40px; width: 180px; height: 240px; background: radial-gradient(circle at 50% 35%, #ffe1bd, #f2a14a 45%, #b8431f); }
.az-tile--3 { bottom: 72px; left: 96px; width: 180px; height: 240px; background: linear-gradient(200deg, #b9e3c9, #2f8f5b 55%, #143524); }
.az-tile--4 { right: 0; bottom: 120px; width: 220px; height: 240px; background: linear-gradient(140deg, #3a332e, #8a7f73 50%, #e8742c 120%); }

/* Quote */
.az-quote { padding-block: 132px; text-align: center; }
.az-quote blockquote { max-width: 640px; margin: 0 auto; font-size: 24px; font-weight: 500; line-height: 1.4; text-wrap: balance; }
.az-quote p { margin: 20px 0 0; color: var(--az-muted); font-size: 13px; line-height: 20px; }

/* Three feature cards */
.az-feature h3 { margin: 18px 0 6px; padding-inline: 20px; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-feature > p { margin: 0; padding-inline: 20px; color: var(--az-muted); font-size: 14px; line-height: 1.55; }
.az-feature-visual { position: relative; display: flex; height: 360px; overflow: hidden; border-radius: 20px; background: var(--az-card); }
.az-feature-visual--gradient { align-items: flex-end; justify-content: center; padding: 24px; background: radial-gradient(90% 70% at 30% 20%, #ffe1bd, transparent 60%), radial-gradient(80% 80% at 70% 80%, #2f8f5b, transparent 65%), #f2a14a; transition: filter .4s; }
.az-feature-visual--gradient.alt { filter: grayscale(.85) brightness(.82); }
.az-toggle { display: inline-flex; gap: 2px; padding: 4px; border-radius: 999px; background: rgba(28,25,23,.28); backdrop-filter: blur(8px); }
.az-toggle button { padding: 6px 14px; border: 0; border-radius: 999px; background: none; color: rgba(255,255,255,.82); font: inherit; font-size: 13px; line-height: 20px; cursor: pointer; }
.az-toggle button.active { background: #fff; color: #000; }
.az-feature-visual--text { align-items: center; padding: 32px; }
.az-feature-visual--text p { margin: 0; font-size: 24px; font-weight: 500; line-height: 1.35; }
.az-feature-visual--text .accent { color: var(--az-accent); }
.az-feature-visual--rows { align-items: center; padding: 20px 28px; }
.az-feature-visual--rows .az-rows { width: 100%; }

/* Checklist cards */
.az-center-title { text-align: center; }
.az-plan { padding: 24px; border: 1px solid var(--az-line); border-radius: 20px; background: #fff; }
.az-plan.featured { border-color: #f2c49a; box-shadow: 0 0 0 3px rgba(242,161,74,.16), 0 12px 32px rgba(232,116,44,.08); }
.az-plan h3 { margin: 0; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-plan-sub { margin: 2px 0 0; color: var(--az-muted); font-size: 14px; line-height: 1.55; }
.az-plan-cta { width: 100%; margin: 28px 0 24px; }
.az-plan-list-title { margin: 0 0 10px; color: var(--az-muted); font-size: 14px; line-height: 20px; }
.az-plan ul, .az-batch-copy ul { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.az-plan li, .az-batch-copy li { position: relative; padding-left: 26px; font-size: 14px; line-height: 20px; }
.az-plan li::before, .az-batch-copy li::before { position: absolute; top: 5px; left: 3px; width: 10px; height: 6px; transform: rotate(-45deg); border-bottom: 1.5px solid currentColor; border-left: 1.5px solid currentColor; content: ""; }

/* Batch */
.az-batch { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); margin-top: 40px; overflow: hidden; border-radius: 20px; background: var(--az-card); }
.az-batch-copy { display: flex; flex-direction: column; align-items: flex-start; padding: 28px; }
.az-batch-copy h3 { margin: 0 0 8px; font-size: 18px; font-weight: 500; line-height: 1.35; }
.az-batch-copy p { margin: 0 0 24px; color: var(--az-muted); font-size: 14px; line-height: 1.55; }
.az-batch-copy ul { margin-bottom: 40px; color: var(--az-body); }
.az-batch-copy .az-btn { margin-top: auto; }
.az-batch-visual { display: grid; min-height: 460px; place-items: center; padding: 40px; background:
  radial-gradient(50% 70% at 20% 0%, rgba(242,161,74,.5), transparent 60%),
  radial-gradient(60% 80% at 100% 100%, rgba(47,143,91,.45), transparent 60%),
  var(--az-dark); }
.az-batch-panel { width: min(520px, 100%); padding: 20px 20px 12px; border-radius: 16px; background: #fff; color: var(--az-ink); box-shadow: 0 24px 60px rgba(0,0,0,.35); }
.az-batch-label { margin: 0 0 8px; color: var(--az-muted); font-size: 12px; font-weight: 500; letter-spacing: .04em; line-height: 16px; text-transform: uppercase; }
.az-mono { font-family: "JetBrains Mono", monospace; font-size: 13px; font-weight: 700; }
.az-score { display: inline-block; min-width: 34px; padding: 2px 8px; border-radius: 999px; font-family: "JetBrains Mono", monospace; font-size: 12px; font-weight: 700; line-height: 18px; text-align: center; }
.az-score--low { background: #dcefe4; color: #087a32; }
.az-score--mid { background: #fdf0d8; color: #9a6500; }
.az-score--high { background: #fff1ec; color: #b23d2c; }

/* FAQ */
.az-faq { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 48px; }
.az-faq-item { border-bottom: 1px solid var(--az-line); }
.az-faq-item button { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 24px; padding: 16px 0; border: 0; background: none; color: var(--az-ink); font: inherit; font-size: 16px; font-weight: 500; line-height: 1.45; text-align: left; cursor: pointer; }
.az-faq-chevron { width: 8px; height: 8px; flex: 0 0 auto; margin-right: 4px; transform: rotate(45deg); border-right: 1.5px solid #a59f97; border-bottom: 1.5px solid #a59f97; transition: transform .25s; }
.az-faq-item.active .az-faq-chevron { transform: rotate(-135deg); }
.az-faq-answer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s ease; }
.az-faq-item.active .az-faq-answer { grid-template-rows: 1fr; }
.az-faq-answer p { min-height: 0; margin: 0; overflow: hidden; color: var(--az-body); font-size: 14px; line-height: 1.65; }
.az-faq-item.active .az-faq-answer p { padding-bottom: 20px; }

/* Final CTA */
.az-final h2 { font-size: 32px; line-height: 1.2; }
.az-final { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 72px 32px; border-top: 1px solid var(--az-line); }

@media (max-width: 960px) {
  .az-hero { grid-template-columns: 1fr; min-height: 0; padding-block: 56px 24px; }
  .az-hero-visual { min-height: 300px; }
  .az-head, .az-faq { grid-template-columns: 1fr; gap: 20px; }
  .az-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .az-grid-title { grid-row: auto; grid-column: 1 / -1; }
  .az-cards--wide, .az-cards--three, .az-batch { grid-template-columns: 1fr; }
  .az-cards--three { gap: 32px; }
  .az-cards--three:has(.az-plan) { gap: 12px; }
  .az-tile { display: none; }
  .az-dark-inner { min-height: 0; padding-block: 88px; }
  .az-statement { grid-template-columns: 1fr; gap: 40px; justify-items: center; text-align: center; }
}
@media (max-width: 640px) {
  .az-rail, .az-dark-inner { width: calc(100% - 24px); }
  .az-section { padding: 72px 16px; }
  .az-hero, .az-final { padding-inline: 16px; }
  .az-final { flex-direction: column; align-items: flex-start; }
  .az-grid { grid-template-columns: 1fr; gap: 28px; margin-top: 40px; }
  .az-page h2 { font-size: 28px; line-height: 1.2; }
  .az-final h2 { font-size: 24px; }
  .az-card { min-height: 0; }
  .az-map { min-height: 380px; }
  .az-map-ip { top: 42%; }
  .az-map-node--you { top: 12%; left: 50%; }
  .az-map-node--other { top: 74%; left: 50%; }
  .az-map-node--bad { top: 90%; left: 50%; }
  .az-map svg { display: none; }
  .az-network-list button { font-size: 20px; }
  .az-batch-visual { min-height: 0; padding: 20px; }
  .az-hero-pill { height: 52px; font-size: 15px; }
}
@media (prefers-reduced-motion: reduce) { .az-orb span { animation: none; } }
</style>
