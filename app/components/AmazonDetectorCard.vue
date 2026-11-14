<script setup lang="ts">
import type { AmazonLandingCopy } from '~/data/amazon-landing'

const props = defineProps<{ copy: AmazonLandingCopy['detector'] }>()
const { t } = useI18n()
const { scan, pending, error, copied, riskScore, riskScoreText, riskLabel, networkType, analysis, countryName, countryFlag, platforms, signalCards, copyIp } = useIpScan()

const tab = ref<'network' | 'flags'>('network')

// Side card cycles through the evaluated platforms, starting on Amazon.
const platformIndex = ref(0)
watchEffect(() => {
  const amazon = platforms.value.findIndex((platform) => platform.name === 'Amazon')
  if (amazon >= 0 && platformIndex.value === 0) platformIndex.value = amazon
})
const currentPlatform = computed(() => platforms.value[platformIndex.value])
function stepPlatform(delta: number) {
  const count = platforms.value.length
  platformIndex.value = (platformIndex.value + delta + count) % count
}

const ipText = computed(() => scan.value?.ip || (pending.value ? t('report.detecting') : t('report.unavailable')))
const locationText = computed(() => error.value || (countryName.value + (scan.value?.city ? ' / ' + scan.value.city : '')))
const sliderPercent = computed(() => scan.value ? Math.min(100, Math.max(0, riskScore.value)) : 0)
const flagTags = computed(() => signalCards.value.map((signal) => ({
  ...signal,
  text: scan.value ? (signal.active ? props.copy.detected : props.copy.clear) : '--',
})))

// Decorative app-rail icons (stroke paths, 24px grid); the active one marks the IP check.
const railIcons = [
  'M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z',
  'M7.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm9 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-9 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm9 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
  'M6 4h9l3 3v13H6zM9 10h6M9 14h6M9 18h4',
  'M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 16h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5',
  'M4 7h6l2 2h8v10H4z',
]
const railIconsBottom = [
  'M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z',
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z',
  'M5 6h14M5 12h14M5 18h9',
]
</script>

<template>
  <div class="azd" aria-label="IP signal check">
    <div class="azd-stage">
      <div class="azd-app">
        <nav class="azd-rail" aria-hidden="true">
          <span class="azd-rail-pause"><i></i><i></i></span>
          <svg v-for="d in railIcons" :key="d" viewBox="0 0 24 24"><path :d="d" /></svg>
          <span class="azd-rail-active"><svg viewBox="0 0 24 24"><path d="M4 12h1M7.5 8v8M11 5v14M14.5 9v6M18 11v2M20 12h0" /></svg></span>
          <svg v-for="d in railIconsBottom" :key="d" viewBox="0 0 24 24"><path :d="d" /></svg>
        </nav>

        <section class="azd-main">
          <span class="azd-chip"><img v-if="countryFlag" :src="countryFlag" alt="" /><i v-else></i>{{ t('report.yourIp') }}</span>
          <div class="azd-ipline">
            <strong>{{ ipText }}</strong>
            <button type="button" class="azd-copy" :disabled="!scan?.ip" :aria-label="t('report.copyIp')" :title="copied ? t('misc.copied') : t('report.copyIp')" @click="copyIp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9h10v10H9zM5 15V5h10" /></svg>
            </button>
          </div>
          <p class="azd-location">{{ locationText }}</p>

          <span class="azd-chip azd-chip--analysis"><img src="/assets/figma/imgLogo.svg" alt="" />{{ t('report.aiAnalysis') }}</span>
          <p class="azd-analysis">
            <span class="azd-tag">[{{ analysis ? riskLabel : t('report.analyzing') }}]</span>
            {{ analysis?.title || t('report.checkingSignals') }}
            <template v-for="flag in flagTags" :key="flag.label">
              <span class="azd-tag" :class="{ bad: flag.active }">[{{ flag.label }}: {{ flag.text }}]</span>{{ ' ' }}
            </template>
          </p>
          <p class="azd-analysis azd-analysis--muted">
            <span class="azd-tag">[{{ t('report.mainConcern').replace(/[:：]\s*$/, '') }}]</span>
            {{ analysis?.concern || t('report.analysisPending') }}
          </p>

          <a class="azd-add" href="/"><span aria-hidden="true">+</span>{{ props.copy.checkAnother }}</a>
        </section>

        <aside class="azd-settings">
          <div class="azd-tabs" role="tablist">
            <button type="button" role="tab" :aria-selected="tab === 'network'" :class="{ active: tab === 'network' }" @click="tab = 'network'">{{ props.copy.tabNetwork }}</button>
            <button type="button" role="tab" :aria-selected="tab === 'flags'" :class="{ active: tab === 'flags' }" @click="tab = 'flags'">{{ props.copy.tabFlags }}</button>
          </div>

          <div v-if="tab === 'network'" class="azd-fields">
            <label>{{ t('report.isp') }}</label>
            <div class="azd-field"><i></i><span>{{ scan?.ISP || t('report.detecting') }}</span></div>
            <label>{{ t('report.networkType') }}</label>
            <div class="azd-field azd-field--accent"><b>IP</b><span>{{ networkType }}</span></div>
            <label>{{ t('status.riskScore') }}<em>{{ riskScoreText }}/100</em></label>
            <div class="azd-slider" :style="{ '--pos': sliderPercent + '%' }"><span></span></div>
            <label>{{ t('report.timezone') }}</label>
            <div class="azd-field"><span>{{ scan?.timezone || t('misc.unknown') }}</span></div>
          </div>

          <ul v-else class="azd-flags">
            <li v-for="flag in flagTags" :key="flag.label">
              <span>{{ flag.label }}</span>
              <em :class="{ bad: flag.active }">{{ flag.text }}</em>
              <i class="azd-switch" :class="{ on: flag.active }" aria-hidden="true"></i>
            </li>
          </ul>
        </aside>
      </div>
    </div>

    <aside class="azd-side">
      <div class="azd-carousel">
        <button type="button" class="azd-arrow" :aria-label="props.copy.prev" @click="stepPlatform(-1)">‹</button>
        <div class="azd-orb">
          <div class="azd-orb-globe" aria-hidden="true"><InteractiveGlobe /></div>
          <div class="azd-orb-center">
            <span class="azd-orb-icon"><PlatformBrandIcon v-if="currentPlatform" :name="currentPlatform.name" :src="currentPlatform.icon" /></span>
            <b>{{ currentPlatform?.readiness?.score ?? '--' }}</b>
          </div>
        </div>
        <button type="button" class="azd-arrow" :aria-label="props.copy.next" @click="stepPlatform(1)">›</button>
      </div>
      <div class="azd-side-caption">
        <h3>{{ currentPlatform?.name }} {{ props.copy.readiness }}</h3>
        <p>{{ props.copy.sideBody }}</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.azd { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 8px; }

/* Gradient stage with the app panel inset from the top-left and running off the other edges */
.azd-stage { position: relative; height: 520px; overflow: hidden; padding: 36px 0 0 30px; border-radius: 20px; background:
  radial-gradient(70% 60% at 0% 100%, #2a120b 0%, transparent 60%),
  radial-gradient(55% 80% at 85% 0%, #5f7a2c 0%, transparent 55%),
  radial-gradient(80% 90% at 30% 10%, #f2482a 0%, transparent 65%),
  linear-gradient(120deg, #e8532c, #c4301c 55%, #7a3a16); }
.azd-stage::after { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E"); mix-blend-mode: overlay; opacity: .55; content: ""; pointer-events: none; }
.azd-app { position: relative; z-index: 1; display: grid; grid-template-columns: 52px minmax(0, 1fr) 236px; height: 100%; border-radius: 14px 0 0 0; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.04); }

/* Icon rail */
.azd-rail { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 22px 0; border-right: 1px solid #f0eeec; }
.azd-rail svg { width: 18px; height: 18px; fill: none; stroke: #57534e; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.azd-rail-pause { display: flex; gap: 3px; margin-bottom: 8px; }
.azd-rail-pause i { width: 3px; height: 13px; border-radius: 1px; background: #0a0a0a; }
.azd-rail-active { display: grid; width: 34px; height: 34px; place-items: center; margin: 6px 0; border-radius: 9px; background: #f2f1ef; }
.azd-rail-active svg { stroke: #0a0a0a; }

/* Main column */
.azd-main { display: flex; min-width: 0; flex-direction: column; align-items: flex-start; padding: 24px 26px 20px; overflow: hidden; }
.azd-chip { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 7px; border: 1px solid #ebe8e4; border-radius: 999px; color: #1c1917; font-size: 13px; line-height: 18px; }
.azd-chip i { width: 14px; height: 14px; border-radius: 50%; background: conic-gradient(#f2a14a, #e8532c, #6c8bd6, #f2a14a); }
.azd-chip img { width: 16px; height: 16px; border-radius: 50%; object-fit: cover; }
.azd-chip--analysis { margin-top: 22px; }
.azd-ipline { display: flex; max-width: 100%; align-items: center; gap: 10px; margin-top: 12px; }
.azd-ipline strong { min-width: 0; overflow-wrap: anywhere; color: #0a0a0a; font-family: "JetBrains Mono", monospace; font-size: clamp(22px, 2.6vw, 32px); font-weight: 700; line-height: 1.15; }
.azd-copy { display: grid; width: 28px; height: 28px; flex: 0 0 auto; place-items: center; padding: 0; border: 1px solid #ebe8e4; border-radius: 7px; background: #fff; cursor: pointer; }
.azd-copy svg { width: 14px; height: 14px; fill: none; stroke: #78716c; stroke-width: 1.8; stroke-linejoin: round; }
.azd-copy:disabled { cursor: default; opacity: .45; }
.azd-location { margin: 6px 0 0; color: #59544f; font-size: 14px; line-height: 20px; }
.azd-analysis { margin: 10px 0 0; color: #1c1917; font-size: 14px; line-height: 1.75; }
.azd-analysis--muted { color: #59544f; }
.azd-tag { color: #e8532c; }
.azd-tag.bad { color: #b42318; font-weight: 600; }
.azd-add { display: flex; width: 100%; align-items: center; gap: 8px; margin-top: auto; padding-top: 16px; color: #1c1917; font-size: 13px; }
.azd-add::before, .azd-add::after { height: 1px; flex: 1; background: #ebe8e4; content: ""; }
.azd-add span { font-size: 16px; line-height: 1; }
.azd-add:hover { color: #e8532c; }

/* Settings column */
.azd-settings { min-width: 0; padding: 18px 0 0 22px; border-left: 1px solid #f0eeec; }
.azd-tabs { display: flex; gap: 22px; border-bottom: 1px solid #ebe8e4; }
.azd-tabs button { margin-bottom: -1px; padding: 6px 0 10px; border: 0; border-bottom: 2px solid transparent; background: none; color: #78716c; font: inherit; font-size: 14px; cursor: pointer; }
.azd-tabs button.active { border-bottom-color: #0a0a0a; color: #0a0a0a; }
.azd-fields { display: flex; flex-direction: column; padding-top: 14px; }
.azd-fields label { display: flex; justify-content: space-between; margin: 12px 0 8px; color: #1c1917; font-size: 13px; line-height: 18px; }
.azd-fields label:first-child { margin-top: 4px; }
.azd-fields label em { padding-right: 14px; color: #78716c; font-family: "JetBrains Mono", monospace; font-size: 12px; font-style: normal; font-weight: 700; }
.azd-field { display: flex; min-width: 0; align-items: center; gap: 9px; padding: 9px 12px; border: 1px solid #ebe8e4; border-right: 0; border-radius: 10px 0 0 10px; color: #1c1917; font-size: 13px; line-height: 18px; }
.azd-field span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.azd-field i { width: 14px; height: 14px; flex: 0 0 auto; border-radius: 50%; background: conic-gradient(#f2a14a, #e8532c, #6c8bd6, #f2a14a); }
.azd-field--accent { border-color: #f4b49b; background: linear-gradient(90deg, #fff 60%, #fff4ee); box-shadow: inset 0 0 0 1px #fde3d8; }
.azd-field b { padding: 1px 6px; border: 1.5px solid #1c1917; border-radius: 999px; font-size: 10px; line-height: 13px; }
.azd-slider { position: relative; height: 18px; margin-right: 0; }
.azd-slider::before { position: absolute; top: 8px; right: 0; left: 0; height: 2px; background: #e7e5e4; content: ""; }
.azd-slider::after { position: absolute; top: 8px; left: 0; width: var(--pos); height: 2px; background: #0a0a0a; content: ""; transition: width .6s ease; }
.azd-slider span { position: absolute; z-index: 1; top: 2px; left: clamp(0px, calc(var(--pos) - 7px), calc(100% - 14px)); width: 14px; height: 14px; border-radius: 50%; background: #0a0a0a; transition: left .6s ease; }
.azd-flags { margin: 0; padding: 14px 0 0; list-style: none; }
.azd-flags li { display: flex; align-items: center; gap: 10px; padding: 12px 18px 12px 0; border-bottom: 1px solid #f0eeec; font-size: 13px; }
.azd-flags span { color: #1c1917; }
.azd-flags em { margin-left: auto; color: #78716c; font-style: normal; }
.azd-flags em.bad { color: #b42318; }
.azd-switch { position: relative; width: 28px; height: 16px; border-radius: 999px; background: #e7e5e4; }
.azd-switch::after { position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.2); content: ""; transition: transform .2s; }
.azd-switch.on { background: #e8532c; }
.azd-switch.on::after { transform: translateX(12px); }

/* Side card */
.azd-side { display: flex; height: 520px; flex-direction: column; justify-content: space-between; padding: 40px 20px 32px; border: 1px solid #ebe8e4; border-radius: 20px; background: #f5f4f2; text-align: center; }
.azd-carousel { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.azd-arrow { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; padding: 0; border: 0; border-radius: 50%; background: none; color: #57534e; font-size: 28px; font-weight: 300; line-height: 1; cursor: pointer; }
.azd-arrow:hover { background: rgba(0,0,0,.05); }
.azd-orb { position: relative; width: min(220px, 100%); aspect-ratio: 1; overflow: hidden; border-radius: 50%; background:
  radial-gradient(60% 60% at 30% 25%, #ffd2b0, transparent 60%),
  radial-gradient(70% 70% at 75% 80%, #5f7a2c, transparent 60%),
  linear-gradient(135deg, #f2a14a, #e8532c 55%, #c4301c); }
.azd-orb-globe { position: absolute; inset: 0; opacity: .5; mix-blend-mode: screen; }
.azd-orb-globe :deep(.interactive-globe) { width: 100%; height: 100%; }
.azd-orb-center { position: absolute; top: 50%; left: 50%; display: flex; width: 84px; height: 84px; flex-direction: column; align-items: center; justify-content: center; gap: 2px; transform: translate(-50%, -50%); border-radius: 50%; background: #fff; box-shadow: 0 8px 24px rgba(28,25,23,.22); }
.azd-orb-icon { display: grid; width: 26px; height: 26px; place-items: center; }
.azd-orb-icon :deep(.platform-brand-icon), .azd-orb-icon :deep(.brand-glyph) { width: 22px; height: 22px; }
.azd-orb-center b { color: #0a0a0a; font-family: "JetBrains Mono", monospace; font-size: 16px; font-weight: 700; line-height: 1; }
.azd-side-caption h3 { margin: 0 0 8px; color: #0a0a0a; font-size: 18px; font-weight: 500; line-height: 1.35; }
.azd-side-caption p { margin: 0; color: #78716c; font-size: 14px; line-height: 1.55; }

@media (max-width: 960px) {
  .azd { grid-template-columns: 1fr; }
  .azd-side { height: auto; gap: 28px; }
}
@media (max-width: 640px) {
  .azd-stage { height: auto; padding: 20px 0 0 14px; }
  .azd-app { grid-template-columns: minmax(0, 1fr); }
  .azd-rail { display: none; }
  .azd-main { padding: 20px 18px 8px; }
  .azd-settings { padding: 14px 0 20px 18px; border-top: 1px solid #f0eeec; border-left: 0; }
}
</style>
