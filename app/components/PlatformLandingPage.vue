<script setup lang="ts">
import type { LandingPageDefinition } from '~/data/landing-pages'
import { landingInline } from '~/utils/landing-markdown'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const props = defineProps<{ page: LandingPageDefinition }>()
const { locale, t } = useI18n()
const copy = computed(() => props.page.copy[locale.value === 'zh' ? 'zh' : 'en'])
const isDevtool = computed(() => props.page.slug === 'chatgpt-ip-check')
const openFaq = ref<number | null>(0)

const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: copy.value.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}))

const social = computed(() => siteSocialMeta({
  path: `/${props.page.slug}`,
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
</script>

<template>
  <div class="platform-landing-page" :class="{ 'platform-landing-page--devtool': props.page.slug === 'chatgpt-ip-check' }">
    <AppHeader />
    <main id="top">
      <section class="platform-landing-hero">
        <div class="platform-landing-hero-wash" aria-hidden="true"></div>
        <video v-if="isDevtool" class="platform-landing-hero-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
          <source src="/assets/gradient-green-hero.mp4" type="video/mp4" />
        </video>
        <div class="platform-landing-hero-inner">
          <div class="platform-landing-hero-copy">
          <div class="platform-landing-kicker"><img :src="props.page.icon" alt="" />{{ props.page.platform }} IP Check</div>
          <h1>{{ copy.h1 }}</h1>
          <p class="platform-landing-sub">{{ copy.sub }}</p>
          <div v-if="props.page.slug === 'chatgpt-ip-check'" class="platform-landing-hero-status" aria-label="ChatGPT IP check status">
            <Badge variant="outline"><i aria-hidden="true"></i> Live Network Scan</Badge>
            <Badge variant="outline">12 Signals</Badge>
            <Badge variant="outline">No Signup</Badge>
          </div>
          <div v-if="isDevtool" class="platform-landing-command-row">
            <div class="platform-landing-command"><span>$</span><code>ipready check --platform chatgpt</code><span class="platform-landing-command-copy" aria-hidden="true">⌘</span></div>
            <Button as="a" size="lg" class="platform-landing-run-cta" href="#scan">Run live check <CurrentIcon class="landing-action-icon" src="/assets/figma/imgVector29.svg" /></Button>
          </div>
          <div v-if="isDevtool" class="platform-landing-hero-scroll"><span>Scroll</span><span aria-hidden="true">↓</span></div>
          <div v-if="!isDevtool" id="scan" class="platform-landing-detector-wrap">
            <PlatformLandingDetector :platform="props.page.platform" />
          </div>
          <a v-if="!isDevtool" class="platform-landing-scroll-cta" href="#why">{{ copy.detectorCta }} <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section v-if="isDevtool" id="scan" class="platform-landing-scan-section">
        <div class="platform-landing-scan-inner">
          <p class="platform-landing-section-index"><span>01</span>Live network readout</p>
          <div class="platform-landing-scan-heading">
            <h2>Read the signals before they become a block.</h2>
            <p>One quick scan turns the hidden connection context into a practical readiness report.</p>
          </div>
          <div class="platform-landing-detector-wrap">
            <PlatformLandingDetector :platform="props.page.platform" />
          </div>
          <div class="platform-landing-signal-rail" aria-label="Signals in this check">
            <span><b>01</b> IP provenance</span>
            <span><b>02</b> Reputation score</span>
            <span><b>03</b> ChatGPT readiness</span>
          </div>
        </div>
      </section>

      <section id="why" class="platform-landing-section platform-landing-why">
        <div class="platform-landing-section-inner">
          <p class="platform-landing-section-index"><span>{{ isDevtool ? '02' : '01' }}</span>{{ isDevtool ? 'Signal map' : copy.whyTitle }}</p>
          <div class="platform-landing-section-heading"><h2>{{ isDevtool ? 'See the network context behind every ChatGPT session.' : copy.whyTitle }}</h2></div>
          <div class="platform-landing-reasons">
            <article v-for="(reason, index) in copy.reasons" :key="reason.title" class="platform-landing-reason">
              <span class="platform-landing-reason-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3>{{ reason.title }}</h3>
              <p v-html="landingInline(reason.body)" />
            </article>
          </div>
        </div>
      </section>

      <section class="platform-landing-section platform-landing-checklist">
        <div class="platform-landing-section-inner platform-landing-checklist-inner">
          <div>
            <p class="platform-landing-section-index"><span>{{ isDevtool ? '03' : '02' }}</span>{{ isDevtool ? 'Runbook' : copy.checklistTitle }}</p>
            <h2>{{ isDevtool ? 'Stabilize the connection before you sign in.' : copy.checklistTitle }}</h2>
          </div>
          <ol class="platform-landing-checklist-list">
            <li v-for="(item, index) in copy.checklist" :key="item"><span>{{ String(index + 1).padStart(2, '0') }}</span><p v-html="landingInline(item)" /></li>
          </ol>
        </div>
      </section>

      <section id="faq" class="platform-landing-section platform-landing-faq">
        <div class="platform-landing-section-inner">
          <p class="platform-landing-section-index"><span>{{ isDevtool ? '04' : '03' }}</span>{{ isDevtool ? 'Questions, answered' : copy.faqTitle }}</p>
          <h2>{{ isDevtool ? 'Questions, answered.' : copy.faqTitle }}</h2>
          <div class="platform-landing-faq-list">
            <article v-for="(item, index) in copy.faq" :key="item.question" class="platform-landing-faq-item" :class="{ active: openFaq === index }">
              <component :is="isDevtool ? Button : 'button'" v-bind="isDevtool ? { variant: 'ghost' as const } : {}" type="button" :aria-expanded="openFaq === index" @click="toggleFaq(index)"><span>{{ item.question }}</span><CurrentIcon v-if="isDevtool" class="platform-landing-faq-toggle landing-faq-icon" src="/assets/figma/imgVector.svg" /><span v-else class="platform-landing-faq-toggle" aria-hidden="true">+</span></component>
              <div class="platform-landing-faq-answer"><p>{{ item.answer }}</p></div>
            </article>
          </div>
        </div>
      </section>

      <section class="platform-landing-links">
        <div class="platform-landing-section-inner">
          <p class="platform-landing-section-index"><span>{{ isDevtool ? '05' : '04' }}</span>{{ isDevtool ? 'Keep exploring' : copy.linksTitle }}</p>
          <div class="platform-landing-links-grid">
            <a v-for="link in copy.links" :key="link.href + link.anchor" :href="link.href" class="platform-landing-link"><span>{{ link.anchor }}</span><span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.platform-landing-page { min-height: 100vh; background: #fff; }
.platform-landing-hero { position: relative; min-height: 960px; margin: -64px 32px 0; overflow: hidden; border-radius: 0 0 24px 24px; background: linear-gradient(180deg, #fbfffc 0%, #f2fbf5 63%, #e0f3e6 100%); }
.platform-landing-hero-wash { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, rgba(255,255,255,.98), rgba(255,255,255,.58) 42%, rgba(224,243,230,.08) 78%); pointer-events: none; }
.platform-landing-hero-inner { position: relative; z-index: 1; width: min(1066px, calc(100% - 48px)); margin: 0 auto; padding: 130px 0 56px; text-align: center; }
.platform-landing-kicker { display: inline-flex; align-items: center; gap: 8px; color: #148a50; font-size: 14px; font-weight: 600; }
.platform-landing-kicker img { width: 20px; height: 20px; object-fit: contain; }
.platform-landing-hero h1 { max-width: 900px; margin: 16px auto 0; color: #0a0a0a; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 600; letter-spacing: 0; line-height: 1.08; }
.platform-landing-sub { max-width: 760px; margin: 18px auto 0; color: #404040; font-size: 16px; line-height: 1.65; }
.platform-landing-detector-wrap { margin-top: 42px; text-align: left; }
.platform-landing-scroll-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; color: var(--blue); font-size: 14px; font-weight: 600; }
.platform-landing-scroll-cta:hover { color: #075fd8; }
.platform-landing-section { padding: 96px 32px; }
.platform-landing-section-inner { width: min(1120px, 100%); margin: 0 auto; }
.platform-landing-section-index { display: flex; gap: 14px; align-items: center; margin: 0 0 18px; color: #7b7b7b; font-size: 12px; font-weight: 600; letter-spacing: .02em; text-transform: uppercase; }
.platform-landing-section-index span { color: #148a50; font-family: "JetBrains Mono", monospace; }
.platform-landing-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 32px; }
.platform-landing-section h2 { max-width: 680px; margin: 0; color: #171717; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: clamp(32px, 4.2vw, 52px); font-weight: 600; line-height: 1.12; }
.platform-landing-section-heading p { max-width: 300px; margin: 0 0 4px; color: #7b7b7b; font-size: 14px; line-height: 1.55; }
.platform-landing-reasons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 44px; margin-top: 62px; border-top: 1px solid #e0e0e2; }
.platform-landing-reason { padding: 28px 0 34px; border-bottom: 1px solid #e0e0e2; }
.platform-landing-reason-number { color: #148a50; font-family: "JetBrains Mono", monospace; font-size: 12px; }
.platform-landing-reason h3 { margin: 18px 0 10px; font-size: 20px; font-weight: 600; line-height: 1.35; }
.platform-landing-reason p { margin: 0; color: #515151; font-size: 14px; line-height: 1.75; }
.platform-landing-reason :deep(strong) { color: #171717; font-weight: 600; }
.platform-landing-reason :deep(code), .platform-landing-checklist-list :deep(code) { padding: 1px 4px; border-radius: 4px; background: #f1f5f8; font-family: "JetBrains Mono", monospace; font-size: .9em; }
.platform-landing-checklist { background: #f6f6f6; }
.platform-landing-checklist-inner { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 84px; }
.platform-landing-checklist h2 { max-width: 420px; }
.platform-landing-checklist-intro { max-width: 380px; margin: 18px 0 0; color: #7b7b7b; font-size: 14px; line-height: 1.65; }
.platform-landing-checklist-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; border-top: 1px solid #d8dcdf; }
.platform-landing-checklist-list li { display: grid; grid-template-columns: 42px 1fr; gap: 14px; padding: 20px 0; border-bottom: 1px solid #d8dcdf; }
.platform-landing-checklist-list li > span { color: #148a50; font-family: "JetBrains Mono", monospace; font-size: 12px; }
.platform-landing-checklist-list p { margin: 0; color: #404040; font-size: 14px; line-height: 1.7; }
.platform-landing-checklist-list :deep(strong) { color: #171717; font-weight: 600; }
.platform-landing-faq { background: #fff; }
.platform-landing-faq > .platform-landing-section-inner > h2 { margin-bottom: 44px; }
.platform-landing-faq-list { width: min(850px, 100%); border-top: 1px solid #e0e0e2; }
.platform-landing-faq-item { border-bottom: 1px solid #e0e0e2; }
.platform-landing-faq-item button { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 24px; padding: 22px 0; border: 0; background: transparent; color: #273229; text-align: left; cursor: pointer; }
.platform-landing-faq-item button > span:first-child { font-size: 16px; font-weight: 600; line-height: 1.45; }
.platform-landing-faq-toggle { color: #148a50; font-family: "JetBrains Mono", monospace; font-size: 24px; font-weight: 400; transition: transform .2s ease; }
.platform-landing-faq-item.active .platform-landing-faq-toggle { transform: rotate(45deg); }
.platform-landing-faq-answer { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .25s ease, opacity .25s ease; }
.platform-landing-faq-answer p { min-height: 0; margin: 0; overflow: hidden; color: #515151; font-size: 14px; line-height: 1.75; transform: translateY(-5px); transition: padding .25s ease, transform .25s ease; }
.platform-landing-faq-item.active .platform-landing-faq-answer { grid-template-rows: 1fr; opacity: 1; }
.platform-landing-faq-item.active .platform-landing-faq-answer p { padding-bottom: 22px; transform: translateY(0); }
.platform-landing-links { padding: 68px 32px 100px; background: #f6f6f6; }
.platform-landing-links-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 32px; }
.platform-landing-link { display: flex; min-height: 92px; align-items: end; justify-content: space-between; gap: 14px; padding: 16px; border: 1px solid #e0e0e2; border-radius: 8px; background: #fff; color: #273229; font-size: 14px; font-weight: 600; transition: border-color .2s ease, transform .2s ease; }
.platform-landing-link:hover { border-color: #148a50; transform: translateY(-2px); }
@media (max-width: 900px) { .platform-landing-hero { margin-inline: 16px; } .platform-landing-section { padding-inline: 24px; } .platform-landing-checklist-inner { grid-template-columns: 1fr; gap: 46px; } .platform-landing-links-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .platform-landing-hero { min-height: 1020px; margin-inline: 0; border-radius: 0; } .platform-landing-hero-inner { width: calc(100% - 32px); padding-top: 112px; } .platform-landing-sub { font-size: 14px; } .platform-landing-section { padding: 64px 20px; } .platform-landing-section-heading { display: block; } .platform-landing-section-heading p { margin-top: 14px; } .platform-landing-reasons { grid-template-columns: 1fr; margin-top: 38px; } .platform-landing-links { padding-inline: 20px; } .platform-landing-links-grid { grid-template-columns: 1fr; } }

/* ChatGPT preview theme: a light, developer-tool landing treatment scoped to one route. */
.platform-landing-page--devtool { background: #f7faf8; color: #111613; }






.platform-landing-page--devtool .platform-landing-hero { min-height: auto; margin: 0; overflow: visible; border-radius: 0; border-bottom: 1px solid #dce5df; background: #f7faf8; }
.platform-landing-page--devtool .platform-landing-hero-wash { inset: 24px; border: 1px solid #e3ebe6; background-color: rgba(247,250,248,.92); background-image: url('/assets/earth-land-texture.jpg'); background-position: center 22%; background-size: cover; background-blend-mode: screen; opacity: .48; }
.platform-landing-page--devtool .platform-landing-hero-inner { width: min(1180px, calc(100% - 64px)); padding: 94px 0 78px; text-align: center; }
.platform-landing-page--devtool .platform-landing-kicker { gap: 9px; color: #0e8750; font-family: "JetBrains Mono", monospace; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
.platform-landing-page--devtool .platform-landing-kicker { justify-content: center; }
.platform-landing-page--devtool .platform-landing-kicker::before { width: 7px; height: 7px; border-radius: 50%; background: #0e8750; content: ""; }
.platform-landing-page--devtool .platform-landing-kicker img { display: none; }
.platform-landing-page--devtool .platform-landing-hero h1 { max-width: 900px; margin: 22px auto 0; color: #111613; font-size: 76px; font-weight: 600; letter-spacing: -.025em; line-height: .98; }
.platform-landing-page--devtool .platform-landing-sub { max-width: 680px; margin: 26px auto 0; color: #56645d; font-size: 17px; line-height: 1.65; }
.platform-landing-page--devtool .platform-landing-hero-status { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 22px; }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"] { display: inline-flex; align-items: center; gap: 7px; padding: 7px 10px; border: 1px solid #d5e4da; border-radius: 999px; background: rgba(255,255,255,.72); color: #52645a; font-family: "JetBrains Mono", monospace; font-size: 11px; line-height: 1; }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"]:first-child { border-color: #acd5b9; color: #0e8750; }
.platform-landing-page--devtool .platform-landing-hero-status i { width: 6px; height: 6px; border-radius: 50%; background: #17a55f; box-shadow: 0 0 0 3px rgba(23,165,95,.12); }
.platform-landing-page--devtool .platform-landing-command-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; margin-top: 26px; }
.platform-landing-page--devtool .platform-landing-command { display: inline-flex; align-items: center; gap: 10px; padding: 11px 13px; border: 1px solid #cdded3; border-radius: 7px; background: rgba(255,255,255,.78); color: #52645a; box-shadow: 0 8px 24px rgba(38,70,52,.06); font-family: "JetBrains Mono", monospace; font-size: 12px; }
.platform-landing-page--devtool .platform-landing-command > span:first-child { color: #0e8750; }
.platform-landing-page--devtool .platform-landing-command code { color: #1b3024; font: inherit; }
.platform-landing-page--devtool .platform-landing-command-copy { display: grid; width: 20px; height: 20px; place-items: center; border-left: 1px solid #d8e4dc; color: #7b9182; }
.platform-landing-page--devtool .platform-landing-run-cta { display: inline-flex; align-items: center; gap: 9px; padding: 12px 15px; border-radius: 7px; background: #159b62; color: #fff; font-size: 13px; font-weight: 600; box-shadow: 0 8px 24px rgba(21,155,98,.18); }
.platform-landing-page--devtool .platform-landing-run-cta:hover { background: #0f804f; }
.platform-landing-page--devtool .platform-landing-detector-wrap { max-width: 1020px; margin: 48px auto 0; }
.platform-landing-page--devtool .landing-detector { border-color: #dce5df; border-radius: 8px; background: #fff; box-shadow: 0 20px 60px rgba(38,70,52,.10); }
.platform-landing-page--devtool :deep(.landing-detector-main) { background: #fff; }
.platform-landing-page--devtool :deep(.landing-detector-side) { border-left: 1px solid #e3ebe6; background: #f2f7f3; }
.platform-landing-page--devtool :deep(.landing-detector-analysis) { border-top-color: #e3ebe6; }
.platform-landing-page--devtool :deep(.landing-detector-signals > div) { border-color: #dce5df; background: #f7faf8; }
.platform-landing-page--devtool :deep(.landing-detector-platform.highlighted) { box-shadow: 0 0 0 1px #9ed1b3, 0 5px 16px rgba(24,75,45,.08); }
.platform-landing-page--devtool .platform-landing-scroll-cta { margin-top: 24px; padding: 9px 12px; border: 1px solid #cfe2d4; border-radius: 7px; background: #eef8f0; color: #0e8750; font-family: "JetBrains Mono", monospace; font-size: 12px; }
.platform-landing-page--devtool .platform-landing-signal-rail { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; width: min(1020px, 100%); margin: 22px auto 0; border-top: 1px solid #cfdad3; border-bottom: 1px solid #cfdad3; }
.platform-landing-page--devtool .platform-landing-signal-rail span { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 12px 14px; color: #607168; font-family: "JetBrains Mono", monospace; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
.platform-landing-page--devtool .platform-landing-signal-rail span + span { border-left: 1px solid #cfdad3; }
.platform-landing-page--devtool .platform-landing-signal-rail b { color: #0e8750; font-weight: 700; }
.platform-landing-page--devtool .platform-landing-section { padding-top: 112px; padding-bottom: 112px; border-bottom: 1px solid #dce5df; }
.platform-landing-page--devtool .platform-landing-section-inner { width: min(1180px, 100%); }
.platform-landing-page--devtool .platform-landing-why { background-color: #f7faf8; background-image: linear-gradient(rgba(14,135,80,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(14,135,80,.035) 1px, transparent 1px); background-size: 56px 56px; }
.platform-landing-page--devtool .platform-landing-section-index { color: #718078; font-family: "JetBrains Mono", monospace; font-size: 11px; letter-spacing: .08em; }
.platform-landing-page--devtool .platform-landing-section-index span { color: #0e8750; }
.platform-landing-page--devtool .platform-landing-section h2 { color: #111613; font-size: 56px; letter-spacing: 0; }
.platform-landing-page--devtool .platform-landing-reasons { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 58px; border-top: 0; }
.platform-landing-page--devtool .platform-landing-reason { position: relative; min-height: 250px; padding: 20px 20px 24px; border: 1px solid #d2dfd6; border-radius: 9px; background: rgba(255,255,255,.78); box-shadow: 0 12px 28px rgba(38,70,52,.035); }
.platform-landing-page--devtool .platform-landing-reason::before { display: block; margin-bottom: 34px; color: #9aac9f; content: "TRACE / SIGNAL"; font-family: "JetBrains Mono", monospace; font-size: 9px; letter-spacing: .09em; }
.platform-landing-page--devtool .platform-landing-reason::after { position: absolute; right: 20px; top: 20px; width: 42px; height: 18px; border-top: 1px solid #b7d8c1; border-bottom: 1px solid #b7d8c1; background: linear-gradient(90deg, transparent 0 18%, #8fc6a0 18% 23%, transparent 23% 39%, #8fc6a0 39% 47%, transparent 47% 69%, #8fc6a0 69% 74%, transparent 74%); opacity: .9; content: ""; }
.platform-landing-page--devtool .platform-landing-reason h3 { max-width: 260px; margin: 0 0 12px; color: #111613; font-size: 19px; letter-spacing: -.015em; }
.platform-landing-page--devtool .platform-landing-reason p { color: #56645d; }
.platform-landing-page--devtool .platform-landing-reason-number { color: #0e8750; font-size: 11px; }
.platform-landing-page--devtool .platform-landing-checklist { background: #fff; }
.platform-landing-page--devtool .platform-landing-checklist-inner { grid-template-columns: minmax(0, .65fr) minmax(0, 1.35fr); gap: 96px; }
.platform-landing-page--devtool .platform-landing-checklist-list { gap: 8px; border-top: 0; }
.platform-landing-page--devtool .platform-landing-checklist-list li { grid-template-columns: 42px 1fr; padding: 18px 16px; border: 1px solid #d2dfd6; border-radius: 8px; background: #f7faf8; }
.platform-landing-page--devtool .platform-landing-checklist-list li::after { align-self: center; color: #7ca58a; content: "↗"; font-family: "JetBrains Mono", monospace; font-size: 13px; }
.platform-landing-page--devtool .platform-landing-checklist-list p { color: #3d4a43; }
.platform-landing-page--devtool .platform-landing-faq { background: #f7faf8; }
.platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner { display: grid; grid-template-columns: minmax(220px, .6fr) minmax(0, 1.4fr); gap: 0 72px; }
.platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner > .platform-landing-section-index, .platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner > h2 { grid-column: 1; }
.platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner > h2 { margin: 0; }
.platform-landing-page--devtool .platform-landing-faq-list { grid-column: 2; grid-row: 1 / span 2; width: 100%; border-top-color: #cfdad3; }
.platform-landing-page--devtool .platform-landing-faq-item { border-bottom-color: #cfdad3; }
.platform-landing-page--devtool .platform-landing-faq-item button { padding: 24px 0; color: #1e2a23; }
.platform-landing-page--devtool .platform-landing-faq-toggle { color: #0e8750; }
.platform-landing-page--devtool .platform-landing-faq-answer p { color: #56645d; }
.platform-landing-page--devtool .platform-landing-links { padding-top: 84px; background: #fff; }
.platform-landing-page--devtool .platform-landing-link { min-height: 110px; border-color: #dce5df; background: #f7faf8; color: #1e2a23; }



@media (max-width: 900px) { .platform-landing-page--devtool .platform-landing-reasons { grid-template-columns: repeat(2, minmax(0, 1fr)); } .platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner { grid-template-columns: 1fr; gap: 24px; } .platform-landing-page--devtool .platform-landing-faq-list { grid-column: 1; grid-row: auto; } }
@media (max-width: 1100px) { .platform-landing-page--devtool .platform-landing-hero h1 { font-size: 64px; } .platform-landing-page--devtool .platform-landing-section h2 { font-size: 48px; } }
@media (max-width: 600px) {
 .platform-landing-page--devtool .platform-landing-hero-wash { inset: 12px; } .platform-landing-page--devtool .platform-landing-hero-inner { width: calc(100% - 40px); padding-top: 64px; padding-bottom: 56px; } .platform-landing-page--devtool .platform-landing-hero h1 { font-size: 42px; line-height: 1; } .platform-landing-page--devtool .platform-landing-sub { font-size: 15px; } .platform-landing-page--devtool .platform-landing-hero-status { gap: 6px; margin-top: 18px; } .platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"] { padding: 7px 8px; font-size: 10px; } .platform-landing-page--devtool .platform-landing-command-row { align-items: stretch; flex-direction: column; } .platform-landing-page--devtool .platform-landing-command, .platform-landing-page--devtool .platform-landing-run-cta { justify-content: center; width: 100%; } .platform-landing-page--devtool .platform-landing-command { font-size: 10px; } .platform-landing-page--devtool .platform-landing-detector-wrap { margin-top: 34px; } .platform-landing-page--devtool .platform-landing-signal-rail { grid-template-columns: 1fr; } .platform-landing-page--devtool .platform-landing-signal-rail span + span { border-top: 1px solid #cfdad3; border-left: 0; } .platform-landing-page--devtool .platform-landing-section { padding: 72px 20px; } .platform-landing-page--devtool .platform-landing-section h2 { font-size: 36px; } .platform-landing-page--devtool .platform-landing-reasons { grid-template-columns: 1fr; margin-top: 40px; } .platform-landing-page--devtool .platform-landing-reason { min-height: 0; } .platform-landing-page--devtool .platform-landing-checklist-inner { grid-template-columns: 1fr; gap: 42px; } .platform-landing-page--devtool .platform-landing-faq > .platform-landing-section-inner { display: block; } .platform-landing-page--devtool .platform-landing-faq-list { margin-top: 36px; } .platform-landing-page--devtool .platform-landing-links { padding-top: 64px; } }

/* ChatGPT dark Frond treatment. Kept route-scoped so the other landing pages retain their current theme. */
.platform-landing-page--devtool { --devtool-bg: #0b100e; --devtool-surface: #111a15; --devtool-surface-raised: #16231b; --devtool-surface-soft: #132019; --devtool-line: #2a3a30; --devtool-line-strong: #38533f; --devtool-text: #edf7ef; --devtool-muted: #91a69a; --devtool-faint: #668071; --devtool-green: #61d78c; --devtool-green-strong: #25c875; --devtool-green-soft: #173b27; background: var(--devtool-bg); color: var(--devtool-text); overflow-x: clip; }













.platform-landing-page--devtool .platform-landing-hero { border-bottom-color: var(--devtool-line); background: var(--devtool-bg); }
.platform-landing-page--devtool .platform-landing-hero-wash { border-color: #22372a; background-color: rgba(14,24,18,.76); background-blend-mode: soft-light; opacity: .72; box-shadow: inset 0 0 100px rgba(45,132,79,.08); }
.platform-landing-page--devtool .platform-landing-kicker { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-kicker::before { background: var(--devtool-green); box-shadow: 0 0 0 4px rgba(97,215,140,.12); }
.platform-landing-page--devtool .platform-landing-hero h1 { color: var(--devtool-text); }
.platform-landing-page--devtool .platform-landing-sub { color: var(--devtool-muted); }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"] { border-color: var(--devtool-line); background: rgba(16,27,21,.78); color: var(--devtool-muted); }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"]:first-child { border-color: #2d7048; color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-hero-status i { background: var(--devtool-green-strong); box-shadow: 0 0 0 3px rgba(37,200,117,.14); }
.platform-landing-page--devtool .platform-landing-command { min-width: 0; border-color: var(--devtool-line-strong); background: rgba(8,14,11,.84); color: var(--devtool-muted); box-shadow: 0 12px 32px rgba(0,0,0,.24); }
.platform-landing-page--devtool .platform-landing-command > span:first-child { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-command code { min-width: 0; color: #c3dcc9; overflow-wrap: anywhere; }
.platform-landing-page--devtool .platform-landing-command-copy { border-left-color: var(--devtool-line); color: var(--devtool-faint); }
.platform-landing-page--devtool .platform-landing-run-cta { background: var(--devtool-green-strong); color: #06110a; box-shadow: 0 10px 28px rgba(37,200,117,.16); }
.platform-landing-page--devtool .platform-landing-run-cta:hover { background: #51e38a; }
.platform-landing-page--devtool .platform-landing-detector-wrap { margin-top: 48px; }
.platform-landing-page--devtool .landing-detector { border-color: var(--devtool-line-strong); background: var(--devtool-surface); box-shadow: 0 24px 80px rgba(0,0,0,.36); }
.platform-landing-page--devtool :deep(.landing-detector-main) { background: var(--devtool-surface); }
.platform-landing-page--devtool :deep(.landing-detector-globe) { opacity: .62; mix-blend-mode: screen; }
.platform-landing-page--devtool :deep(.landing-detector-overline), .platform-landing-page--devtool :deep(.landing-detector-label) { color: var(--devtool-faint); }
.platform-landing-page--devtool :deep(.landing-detector-ipline strong) { color: var(--devtool-text); }
.platform-landing-page--devtool :deep(.landing-detector-copy) { border-color: var(--devtool-line-strong); background: #16241b; color: var(--devtool-muted); }
.platform-landing-page--devtool :deep(.landing-detector-country) { color: #c7d9cc; }
.platform-landing-page--devtool :deep(.landing-detector-facts) { background: rgba(18,31,23,.76); }
.platform-landing-page--devtool :deep(.landing-detector-facts > div + div) { border-left-color: var(--devtool-line); }
.platform-landing-page--devtool :deep(.landing-detector-facts b) { color: #d7e8db; }
.platform-landing-page--devtool :deep(.landing-detector-facts span) { color: var(--devtool-faint); }
.platform-landing-page--devtool :deep(.landing-detector-analysis) { border-top-color: var(--devtool-line); background: rgba(13,22,17,.64); }
.platform-landing-page--devtool :deep(.landing-detector-analysis-title) { color: var(--devtool-text); }
.platform-landing-page--devtool :deep(.landing-detector-analysis h2) { color: var(--devtool-text); }
.platform-landing-page--devtool :deep(.landing-detector-analysis p) { color: var(--devtool-muted); }
.platform-landing-page--devtool :deep(.landing-detector-signals > div) { border-color: var(--devtool-line); background: #152119; }
.platform-landing-page--devtool :deep(.landing-detector-signals > div.active) { border-color: #82513f; background: #2a1e19; }
.platform-landing-page--devtool :deep(.landing-detector-signals span) { color: var(--devtool-faint); }
.platform-landing-page--devtool :deep(.landing-detector-signals b) { color: var(--devtool-green); }
.platform-landing-page--devtool :deep(.landing-detector-signals > div.active b) { color: #f0a28c; }
.platform-landing-page--devtool :deep(.landing-detector-side) { border-left-color: var(--devtool-line); background: #101a14; }
.platform-landing-page--devtool :deep(.landing-detector-score strong) { color: var(--devtool-green); }
.platform-landing-page--devtool :deep(.landing-detector-score span) { color: var(--devtool-muted); }
.platform-landing-page--devtool :deep(.landing-detector-score em) { background: var(--devtool-green-soft); color: var(--devtool-green); }
.platform-landing-page--devtool :deep(.landing-detector-rule) { background: var(--devtool-line); }
.platform-landing-page--devtool :deep(.landing-detector-platform) { border-bottom-color: var(--devtool-line); }
.platform-landing-page--devtool :deep(.landing-detector-platform.highlighted) { background: #193323; box-shadow: 0 0 0 1px #3c8857, 0 8px 20px rgba(32,117,64,.18); }
.platform-landing-page--devtool :deep(.landing-detector-platform > span) { color: #c9ddce; }
.platform-landing-page--devtool :deep(.landing-detector-platform b) { color: var(--devtool-green); }
.platform-landing-page--devtool :deep(.landing-detector-icon) { border-color: var(--devtool-line); background: #1a281f; }
.platform-landing-page--devtool :deep(.landing-detector-link) { color: var(--devtool-green); }
.platform-landing-page--devtool :deep(.landing-detector-link:hover) { background: rgba(97,215,140,.1); }
.platform-landing-page--devtool .platform-landing-scroll-cta { border-color: #2d6543; background: #12291b; color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-signal-rail { border-top-color: var(--devtool-line-strong); border-bottom-color: var(--devtool-line-strong); }
.platform-landing-page--devtool .platform-landing-signal-rail span { color: var(--devtool-faint); }
.platform-landing-page--devtool .platform-landing-signal-rail span + span { border-left-color: var(--devtool-line-strong); }
.platform-landing-page--devtool .platform-landing-signal-rail b { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-section { border-bottom-color: var(--devtool-line); }
.platform-landing-page--devtool .platform-landing-why { background-color: var(--devtool-bg); background-image: linear-gradient(rgba(97,215,140,.075) 1px, transparent 1px), linear-gradient(90deg, rgba(97,215,140,.075) 1px, transparent 1px); }
.platform-landing-page--devtool .platform-landing-section-index { color: var(--devtool-faint); }
.platform-landing-page--devtool .platform-landing-section-index span { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-section h2 { color: var(--devtool-text); }
.platform-landing-page--devtool .platform-landing-reason { border-color: var(--devtool-line-strong); background: rgba(17,27,21,.78); box-shadow: 0 16px 36px rgba(0,0,0,.16); }
.platform-landing-page--devtool .platform-landing-reason::before { color: var(--devtool-faint); }
.platform-landing-page--devtool .platform-landing-reason::after { border-top-color: #39784d; border-bottom-color: #39784d; background: linear-gradient(90deg, transparent 0 18%, #55b873 18% 23%, transparent 23% 39%, #55b873 39% 47%, transparent 47% 69%, #55b873 69% 74%, transparent 74%); }
.platform-landing-page--devtool .platform-landing-reason-number { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-reason h3 { color: var(--devtool-text); }
.platform-landing-page--devtool .platform-landing-reason p { color: var(--devtool-muted); }
.platform-landing-page--devtool .platform-landing-reason :deep(strong), .platform-landing-page--devtool .platform-landing-checklist-list :deep(strong) { color: #dcece0; }
.platform-landing-page--devtool .platform-landing-reason :deep(code), .platform-landing-page--devtool .platform-landing-checklist-list :deep(code) { background: #1d2d23; color: #c8e5cf; }
.platform-landing-page--devtool .platform-landing-checklist { background: #101713; }
.platform-landing-page--devtool .platform-landing-checklist-list li { border-color: var(--devtool-line-strong); background: var(--devtool-surface-soft); }
.platform-landing-page--devtool .platform-landing-checklist-list li::after { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-checklist-list li > span { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-checklist-list p { color: var(--devtool-muted); }
.platform-landing-page--devtool .platform-landing-faq { background: #0d1410; }
.platform-landing-page--devtool .platform-landing-faq-list { border-top-color: var(--devtool-line-strong); }
.platform-landing-page--devtool .platform-landing-faq-item { border-bottom-color: var(--devtool-line-strong); }
.platform-landing-page--devtool .platform-landing-faq-item button { color: var(--devtool-text); }
.platform-landing-page--devtool .platform-landing-faq-toggle { color: var(--devtool-green); }
.platform-landing-page--devtool .platform-landing-faq-answer p { color: var(--devtool-muted); }
.platform-landing-page--devtool .platform-landing-links { background: #101713; }
.platform-landing-page--devtool .platform-landing-link { border-color: var(--devtool-line-strong); background: var(--devtool-surface-soft); color: var(--devtool-text); }
.platform-landing-page--devtool .platform-landing-link:hover { border-color: var(--devtool-green); background: #172a1e; }







@media (max-width: 600px) { .platform-landing-page--devtool .platform-landing-command { justify-content: flex-start; text-align: left; } .platform-landing-page--devtool .platform-landing-command code { line-height: 1.4; } .platform-landing-page--devtool :deep(.landing-detector-signals) { gap: 6px; } .platform-landing-page--devtool :deep(.landing-detector-signals > div) { padding-inline: 6px; } }

/* Recompose the ChatGPT hero around the supplied Frond reference: one immersive viewport, copy on the right, and scan content below. */
.platform-landing-page--devtool { background: #f1f3f0; }









.platform-landing-page--devtool .platform-landing-hero { min-height: calc(100svh - 20px); margin: 20px 20px 0; overflow: hidden; border: 1px solid rgba(0,40,27,.3); border-radius: 28px 28px 0 0; background: #003c2a; }
.platform-landing-page--devtool .platform-landing-hero-video { position: absolute; z-index: 0; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.2) hue-rotate(72deg) brightness(.66) contrast(1.12); opacity: .92; }
.platform-landing-page--devtool .platform-landing-hero-wash { z-index: 1; inset: 0; border: 0; background: rgba(0,47,30,.4); mix-blend-mode: multiply; opacity: .96; box-shadow: inset 0 0 100px rgba(0,0,0,.24); }
.platform-landing-page--devtool .platform-landing-hero-inner { display: flex; width: 100%; min-height: calc(100svh - 20px); align-items: center; padding: 110px 0 40px; text-align: center; }
.platform-landing-page--devtool .platform-landing-hero-copy { width: min(760px, calc(100% - 48px)); margin: 0 auto; }
.platform-landing-page--devtool .platform-landing-kicker { color: #d9fbe5; }
.platform-landing-page--devtool .platform-landing-kicker::before { background: #00d68b; }
.platform-landing-page--devtool .platform-landing-hero h1 { max-width: 760px; margin: 24px auto 0; color: #f8fffb; font-size: 92px; font-weight: 600; letter-spacing: -.055em; line-height: .93; text-wrap: balance; }
.platform-landing-page--devtool .platform-landing-sub { max-width: 700px; margin: 34px auto 0; color: rgba(230,255,238,.72); font-size: 20px; line-height: 1.55; }
.platform-landing-page--devtool .platform-landing-hero-status { margin-top: 24px; }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"] { border-color: rgba(224,255,237,.2); background: rgba(0,47,30,.22); color: rgba(236,255,243,.82); }
.platform-landing-page--devtool .platform-landing-hero-status [data-slot="badge"]:first-child { border-color: rgba(0,226,145,.64); color: #b9ffda; }
.platform-landing-page--devtool .platform-landing-command-row { margin-top: 34px; }
.platform-landing-page--devtool .platform-landing-command { border-color: rgba(228,255,239,.24); background: rgba(0,46,31,.22); color: #dbf9e5; box-shadow: inset 0 0 0 1px rgba(255,255,255,.04); }
.platform-landing-page--devtool .platform-landing-command code { color: #eafff0; }
.platform-landing-page--devtool .platform-landing-run-cta { background: #00cd87; color: #003321; box-shadow: 0 12px 32px rgba(0,205,135,.22); }
.platform-landing-page--devtool .platform-landing-run-cta:hover { background: #25e29e; }
.platform-landing-page--devtool .platform-landing-hero-scroll { position: absolute; right: 50%; bottom: 18px; display: inline-flex; align-items: center; gap: 8px; color: rgba(231,255,239,.75); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; transform: translateX(50%); }
.platform-landing-page--devtool .platform-landing-hero-scroll span:last-child { color: #00d68b; font-size: 16px; }
.platform-landing-page--devtool .platform-landing-scan-section { padding: 118px 32px 124px; border-bottom: 1px solid var(--devtool-line); background: #0b100e; }
.platform-landing-page--devtool .platform-landing-scan-inner { width: min(1180px, 100%); margin: 0 auto; }
.platform-landing-page--devtool .platform-landing-scan-heading { display: flex; align-items: end; justify-content: space-between; gap: 56px; margin-top: 16px; }
.platform-landing-page--devtool .platform-landing-scan-heading h2 { max-width: 720px; margin: 0; color: var(--devtool-text); font-size: 58px; letter-spacing: -.035em; line-height: 1; }
.platform-landing-page--devtool .platform-landing-scan-heading p { max-width: 300px; margin: 0 0 4px; color: var(--devtool-muted); font-size: 15px; line-height: 1.6; }
.platform-landing-page--devtool .platform-landing-scan-section .platform-landing-detector-wrap { max-width: 1020px; margin: 52px auto 0; }
.platform-landing-page--devtool .platform-landing-scan-section .platform-landing-signal-rail { margin-top: 22px; }
@media (max-width: 1100px) { .platform-landing-page--devtool .platform-landing-hero h1 { font-size: 76px; } .platform-landing-page--devtool .platform-landing-scan-heading h2 { font-size: 48px; } }
.platform-landing-page--devtool :deep(.interactive-globe) { max-width: 100%; }











.platform-landing-page--devtool .platform-landing-hero-video { filter: saturate(2.2) brightness(.54) contrast(1.25); mix-blend-mode: screen; opacity: .5; }
.platform-landing-page--devtool .platform-landing-hero-wash { background: radial-gradient(circle at 78% 58%, rgba(0,210,124,.42), transparent 36%), radial-gradient(circle at 27% 74%, rgba(0,127,74,.58), transparent 42%), linear-gradient(120deg, rgba(0,49,33,.72), rgba(0,112,70,.42) 55%, rgba(0,191,113,.5)); mix-blend-mode: normal; opacity: .95; }
.platform-landing-page--devtool .platform-landing-hero-copy { transform: none; }
@media (max-width: 700px) {





 .platform-landing-page--devtool .platform-landing-hero-copy { transform: none; } }
/* Keep the shared site chrome and controls on their native styles. */
.platform-landing-page--devtool :deep(.site-header) { background: #fff; color: var(--ink); }
.platform-landing-page--devtool :deep(.site-footer) { margin-top: 0; padding-top: 72px; background: #fff; color: var(--ink); }
.platform-landing-page--devtool .landing-action-icon { width: 16px; height: 16px; }
.platform-landing-page--devtool .landing-faq-icon { width: 18px; height: 18px; flex: 0 0 18px; }
.platform-landing-page--devtool .platform-landing-faq-item button { height: auto; white-space: normal; }
.platform-landing-page--devtool .platform-landing-faq-item button > span:first-child { min-width: 0; }
@media (max-width: 700px) {
  .platform-landing-page--devtool :deep(.site-header) { position: sticky; }
  .platform-landing-page--devtool .platform-landing-hero { margin: 12px 12px 0; }
  .platform-landing-page--devtool .platform-landing-hero-inner { padding: 96px 0 72px; }
  .platform-landing-page--devtool .platform-landing-hero-copy { width: calc(100% - 32px); margin: 0 auto; }
  .platform-landing-page--devtool .platform-landing-hero h1 { font-size: 48px; }
  .platform-landing-page--devtool .platform-landing-sub { font-size: 16px; }
  .platform-landing-page--devtool .platform-landing-scan-section { padding: 72px 20px; }
  .platform-landing-page--devtool .platform-landing-scan-heading { display: block; }
  .platform-landing-page--devtool .platform-landing-scan-heading h2 { font-size: 38px; }
  .platform-landing-page--devtool .platform-landing-scan-heading p { margin-top: 20px; }
}
</style>
