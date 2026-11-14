<script setup lang="ts">
import { formatRiskScore } from '#shared/utils/ip-display'

interface Props { platform: string }

const props = defineProps<Props>()
const { t } = useI18n()
const { scan, pending, error, copied, riskScore, riskLabel, networkType, analysis, countryName, countryFlag, platforms, signalCards, copyIp } = useIpScan()
</script>

<template>
  <article class="landing-detector" aria-label="IP signal check">
    <div class="landing-detector-main">
      <div class="landing-detector-globe" aria-hidden="true"><InteractiveGlobe /></div>
      <div class="landing-detector-heading">
        <p class="landing-detector-overline">{{ t('report.yourIp') }}</p>
        <div class="landing-detector-ipline">
          <strong>{{ scan?.ip || (pending ? t('report.detecting') : t('report.unavailable')) }}</strong>
          <button class="landing-detector-copy" type="button" :disabled="!scan?.ip" :aria-label="t('report.copyIp')" :title="copied ? t('misc.copied') : t('report.copyIp')" @click="copyIp"><span aria-hidden="true">⧉</span></button>
        </div>
        <div class="landing-detector-country"><img v-if="countryFlag" :src="countryFlag" alt="" /><b>{{ error || (countryName + (scan?.city ? ' / ' + scan.city : '')) }}</b></div>
      </div>
      <div class="landing-detector-facts">
        <div><b>{{ scan?.ISP || t('report.detecting') }}</b><span>{{ t('report.isp') }}</span></div>
        <div><b>{{ networkType }}</b><span>{{ t('report.networkType') }}</span></div>
        <div><b>{{ scan?.timezone || t('misc.unknown') }}</b><span>{{ t('report.timezone') }}</span></div>
      </div>
      <div class="landing-detector-analysis">
        <div class="landing-detector-analysis-title"><img src="/assets/figma/imgLogo.svg" alt="" /><b>{{ t('report.aiAnalysis') }}</b></div>
        <h2><span v-if="scan" aria-hidden="true">{{ riskScore <= 30 ? '👍' : '⚠️' }}</span> {{ analysis?.title || t('report.analyzing') }}</h2>
        <p>{{ analysis?.summary || t('report.checkingSignals') }}</p>
        <p><b>{{ t('report.mainConcern') }}</b>{{ ' ' + (analysis?.concern || t('report.analysisPending')) }}</p>
        <div class="landing-detector-signals" aria-label="Network signal cards">
          <div v-for="signal in signalCards" :key="signal.label" :class="{ active: signal.active }"><span>{{ signal.label }}</span><b>{{ signal.value }}</b></div>
        </div>
      </div>
    </div>
    <aside class="landing-detector-side">
      <p class="landing-detector-label">{{ t('status.riskScore') }}</p>
      <div class="landing-detector-score"><strong>{{ scan ? formatRiskScore(riskScore) : '--' }}</strong><span>/100</span><em>{{ scan ? riskLabel : t('report.checkingSignals') }}</em></div>
      <div class="landing-detector-rule"></div>
      <p class="landing-detector-label">{{ t('report.quickRead') }}</p>
      <div class="landing-detector-platforms">
        <div v-for="platform in platforms" :key="platform.name" class="landing-detector-platform" :class="{ highlighted: platform.name === props.platform }">
          <span><span class="landing-detector-icon"><PlatformBrandIcon :name="platform.name" :src="platform.icon" /></span>{{ platform.name }}</span><b>{{ platform.readiness?.score ?? '--' }}</b>
        </div>
      </div>
      <a class="landing-detector-link" href="/#readiness">{{ t('report.otherPlatforms') }} <span aria-hidden="true">→</span></a>
    </aside>
  </article>
</template>

<style scoped>
.landing-detector { display: grid; grid-template-columns: minmax(0, 1fr) 300px; min-height: 496px; overflow: hidden; border: 1px solid rgba(255,255,255,.72); border-radius: 14px; background: #fff; box-shadow: 0 28px 72px rgba(31,63,104,.14); }
.landing-detector-main { position: relative; min-width: 0; overflow: hidden; background: #fff; }
.landing-detector-globe { position: absolute; top: 4px; right: 2%; width: 47%; height: 190px; opacity: .92; pointer-events: none; }
.landing-detector-globe :deep(.interactive-globe) { width: 100%; opacity: 1; }
.landing-detector-heading { position: relative; z-index: 1; padding: 24px 24px 0; }
.landing-detector-overline, .landing-detector-label { margin: 0; color: #64748d; font-size: 12px; font-weight: 600; line-height: 16px; }
.landing-detector-ipline { display: flex; align-items: center; gap: 14px; margin-top: 14px; }
.landing-detector-ipline strong { font-family: "JetBrains Mono", monospace; font-size: clamp(26px, 3.3vw, 42px); line-height: 1.1; }
.landing-detector-copy { display: grid; width: 32px; height: 32px; place-items: center; padding: 0; border: 1px solid rgba(0,0,0,.12); border-radius: 6px; background: #fff; color: #64748d; cursor: pointer; }
.landing-detector-copy:disabled { cursor: default; opacity: .4; }
.landing-detector-country { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: #404040; font-size: 14px; }
.landing-detector-country img { width: auto; height: 17px; }
.landing-detector-facts { position: relative; z-index: 1; display: flex; gap: 0; margin: 28px 24px 0; padding: 11px 0; border-radius: 10px; background: rgba(255,255,255,.68); backdrop-filter: blur(6px); }
.landing-detector-facts > div { min-width: 0; flex: 1; padding: 0 16px; }
.landing-detector-facts > div + div { border-left: 1px solid #e5e7eb; }
.landing-detector-facts b, .landing-detector-facts span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.landing-detector-facts b { color: var(--ink); font-size: 13px; font-weight: 600; line-height: 18px; }
.landing-detector-facts span { margin-top: 2px; color: #64748d; font-size: 11px; line-height: 15px; }
.landing-detector-analysis { position: absolute; right: 0; bottom: 0; left: 0; min-height: 246px; padding: 20px 24px 24px; border-top: 1px solid rgba(0,0,0,.08); }
.landing-detector-analysis-title { display: flex; align-items: center; gap: 8px; font-size: 15px; }
.landing-detector-analysis-title img { width: 22px; height: 22px; }
.landing-detector-analysis h2 { margin: 14px 0 7px; font-size: 18px; font-weight: 700; line-height: 26px; }
.landing-detector-analysis p { margin: 0; color: #404040; font-size: 13px; line-height: 19px; }
.landing-detector-analysis p + p { margin-top: 6px; }
.landing-detector-signals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
.landing-detector-signals > div { display: flex; min-width: 0; flex-direction: column; gap: 2px; padding: 7px 8px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f8fafb; }
.landing-detector-signals > div.active { border-color: #f0b3a5; background: #fff4f1; }
.landing-detector-signals span { color: #64748d; font-size: 10px; line-height: 13px; }
.landing-detector-signals b { overflow: hidden; color: #087a32; font-size: 11px; line-height: 14px; text-overflow: ellipsis; white-space: nowrap; }
.landing-detector-signals > div.active b { color: #b23d2c; }
.landing-detector-side { padding: 20px; background: #f4f7fb; }
.landing-detector-score { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 7px; margin-top: 6px; }
.landing-detector-score strong { color: #12b84f; font-family: "JetBrains Mono", monospace; font-size: 48px; line-height: 1; }
.landing-detector-score span { padding-bottom: 4px; color: #404040; font-family: "JetBrains Mono", monospace; font-size: 13px; }
.landing-detector-score em { margin-bottom: 3px; padding: 5px 7px; border-radius: 6px; background: #dcefe4; color: #087a32; font-size: 11px; font-style: normal; line-height: 14px; }
.landing-detector-rule { height: 1px; margin: 18px 0 14px; background: rgba(0,0,0,.12); }
.landing-detector-platforms { margin-top: 5px; }
.landing-detector-platform { display: flex; min-height: 42px; align-items: center; justify-content: space-between; padding: 6px 7px; border-bottom: 1px solid rgba(0,0,0,.1); border-radius: 6px; }
.landing-detector-platform.highlighted { background: #fff; box-shadow: 0 4px 12px rgba(24,55,88,.08); }
.landing-detector-platform > span { display: inline-flex; min-width: 0; align-items: center; gap: 7px; color: #273229; font-size: 13px; font-weight: 500; }
.landing-detector-platform b { color: var(--deep-green); font-family: "JetBrains Mono", monospace; font-size: 13px; }
.landing-detector-icon { display: grid; width: 24px; height: 24px; place-items: center; padding: 3px; border: 1px solid rgba(0,0,0,.06); border-radius: 6px; background: #fff; }
.landing-detector-icon :deep(.platform-brand-icon), .landing-detector-icon :deep(.brand-glyph) { width: 18px; height: 18px; }
.landing-detector-link { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 10px; padding: 8px; border-radius: 6px; color: var(--blue); font-size: 12px; font-weight: 500; }
.landing-detector-link:hover { background: rgba(22,119,255,.08); }
@media (max-width: 760px) { .landing-detector { grid-template-columns: 1fr; } .landing-detector-main { min-height: 468px; } .landing-detector-side { min-height: 0; } .landing-detector-globe { right: -5%; width: 56%; opacity: .72; } }
@media (max-width: 480px) { .landing-detector-facts { margin-inline: 16px; } .landing-detector-heading, .landing-detector-analysis { padding-inline: 16px; } .landing-detector-ipline strong { font-size: 24px; } }
</style>
