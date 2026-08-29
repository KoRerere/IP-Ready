<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const languages = [
  { code: 'en', label: 'English', flag: '/assets/icons/flags/US.svg' },
  { code: 'zh', label: '中文', flag: '/assets/icons/flags/CN.svg' },
] as const

const current = computed(() => languages.find((item) => item.code === locale.value) ?? languages[0])

const pill = reactive({ y: 0, h: 0, visible: false, snap: false })

function movePill(event: Event) {
  if (!canHover()) return
  const button = event.currentTarget as HTMLElement
  pill.y = button.offsetTop
  pill.h = button.offsetHeight
  if (!pill.visible) {
    // 首次出现时跳到位，不播滑入动画
    pill.snap = true
    requestAnimationFrame(() => requestAnimationFrame(() => { pill.snap = false }))
  }
  pill.visible = true
}

function hidePill() {
  pill.visible = false
}

watch(open, (value) => {
  if (!value) pill.visible = false
})

function choose(code: Locale) {
  setLocale(code)
  open.value = false
}

function onDocumentClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

let hoverTimer: ReturnType<typeof setTimeout> | undefined
const canHover = () => window.matchMedia('(hover: hover)').matches

function openOnHover() {
  if (!canHover()) return
  clearTimeout(hoverTimer)
  open.value = true
}

function closeOnHoverLeave() {
  if (!canHover()) return
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => { open.value = false }, 120)
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})
onBeforeUnmount(() => {
  clearTimeout(hoverTimer)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="root" class="lang-switcher" :class="{ open }" @mouseenter="openOnHover" @mouseleave="closeOnHoverLeave">
    <button class="lang-toggle" type="button" :aria-label="t('lang.switch')" :aria-expanded="open" @click="open = !open">
      <img class="lang-flag" :src="current.flag" alt="" />
      <span class="lang-label">{{ current.label }}</span>
      <svg class="lang-chevron" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
    <Transition name="lang-dropdown" :duration="260">
      <ul v-if="open" class="lang-dropdown" role="listbox" :aria-label="t('lang.switch')" @mouseleave="hidePill">
        <span class="lang-morph-pill" :class="{ visible: pill.visible, snap: pill.snap }" :style="{ transform: `translateY(${pill.y}px)`, height: `${pill.h}px` }" aria-hidden="true"></span>
        <li v-for="item in languages" :key="item.code">
          <button type="button" role="option" :aria-selected="item.code === locale" :class="{ active: item.code === locale }" @mouseenter="movePill" @focus="movePill" @click="choose(item.code)">
            <img class="lang-flag" :src="item.flag" alt="" />
            <span class="lang-dropdown-label">{{ item.label }}</span>
            <span v-if="item.code === locale" class="lang-check">
              <svg viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5.2 4.4 8.6 11 1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang-switcher { position: relative; flex: 0 0 auto; margin-left: 4px; }
.lang-toggle { display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px; border: 0; border-radius: 999px; background: transparent; color: var(--ink-soft); font-size: 14px; font-weight: 500; line-height: 20px; cursor: pointer; transition: color .2s, box-shadow .2s; }
.lang-toggle:hover { color: #0a0a0a; }
.lang-switcher.open .lang-toggle { color: #0a0a0a; }
.lang-flag { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 1px rgba(0, 0, 0, .08); }
.lang-chevron { width: 10px; height: 6px; transition: transform .25s cubic-bezier(.34, 1.56, .64, 1); }
.lang-switcher.open .lang-chevron { transform: rotate(180deg); }

.lang-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 40;
  min-width: 190px;
  margin: 0;
  padding: 7px;
  list-style: none;
  border: 1px solid rgba(0, 0, 0, .06);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .07);
  transform-origin: top right;
}
.lang-dropdown button { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 12px; border: 0; border-radius: 6px; background: transparent; -webkit-appearance: none; appearance: none; color: var(--ink-soft); font-size: 14px; font-weight: 500; cursor: pointer; transition: color .15s; }
.lang-dropdown button.active { color: #0a0a0a; }
.lang-morph-pill { position: absolute; top: 0; left: 7px; right: 7px; height: 0; border-radius: 6px; background: #F1F5F8; opacity: 0; pointer-events: none; transition: transform .45s cubic-bezier(.3, 1.35, .45, 1), height .45s cubic-bezier(.3, 1.35, .45, 1), opacity .2s ease; }
.lang-morph-pill.visible { opacity: 1; }
.lang-morph-pill.snap { transition: opacity .2s ease; }
.lang-dropdown-label { flex: 1 1 auto; text-align: left; }
.lang-check { display: inline-flex; width: 14px; height: 14px; flex: 0 0 auto; color: #16a34a; }
.lang-check svg { width: 100%; height: 100%; }

.lang-dropdown-enter-active { transition: opacity .22s ease, transform .3s cubic-bezier(.34, 1.45, .64, 1); }
.lang-dropdown-leave-active { transition: opacity .16s ease, transform .16s ease; }
.lang-dropdown-enter-from, .lang-dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(.94); }

@media (max-width: 900px) {
  .lang-switcher { margin-left: 8px; }
  .lang-toggle { padding: 8px 9px; }
  .lang-label { display: none; }
  .lang-dropdown { right: -60px; }
}
</style>
