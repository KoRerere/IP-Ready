<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const props = defineProps<{ status: string }>()
const emit = defineEmits<{ change: [value: string] }>()

const OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'unpublished', label: '下架' },
]

const TRIGGER_TONE: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-100',
  published: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  unpublished: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
}

const open = ref(false)
const activeIndex = ref(0)
const viewportEl = ref<HTMLElement | null>(null)
const pillStyle = ref<Record<string, string>>({ opacity: '0' })

const triggerClass = computed(() => [
  'h-7 w-auto justify-center gap-1 rounded-full border-0 px-3 text-[12px] font-medium shadow-none focus-visible:ring-2',
  TRIGGER_TONE[props.status] ?? TRIGGER_TONE.draft!,
])

/** 把胶囊移动到当前高亮项的位置 */
function movePill(animate = true) {
  const vp = viewportEl.value
  if (!vp) return
  const items = Array.from(vp.querySelectorAll<HTMLElement>('[role="option"]'))
  const el = items[activeIndex.value]
  if (!el) {
    pillStyle.value = { opacity: '0' }
    return
  }
  pillStyle.value = {
    opacity: '1',
    transform: `translateY(${el.offsetTop}px)`,
    height: `${el.offsetHeight}px`,
    transition: animate
      ? 'transform .18s cubic-bezier(.4, 0, .2, 1), height .18s cubic-bezier(.4, 0, .2, 1), opacity .12s ease'
      : 'none',
  }
}

/** 键盘上下键时 reka 会在选项上标记 data-highlighted,观察它来同步胶囊 */
function syncFromDom() {
  const vp = viewportEl.value
  if (!vp) return
  const items = Array.from(vp.querySelectorAll<HTMLElement>('[role="option"]'))
  const i = items.findIndex((el) => el.hasAttribute('data-highlighted'))
  if (i >= 0 && i !== activeIndex.value) {
    activeIndex.value = i
    movePill()
  }
}

function onPointerOver(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest?.('[role="option"]') as HTMLElement | null
  const vp = viewportEl.value
  if (!target || !vp) return
  const items = Array.from(vp.querySelectorAll<HTMLElement>('[role="option"]'))
  const i = items.indexOf(target)
  if (i >= 0 && i !== activeIndex.value) {
    activeIndex.value = i
    movePill()
  }
}

let observer: MutationObserver | undefined

watch(open, async (isOpen) => {
  if (!isOpen) {
    observer?.disconnect()
    observer = undefined
    return
  }
  await nextTick()
  activeIndex.value = Math.max(0, OPTIONS.findIndex((o) => o.value === props.status))
  await nextTick()
  movePill(false)
  if (viewportEl.value) {
    observer = new MutationObserver(syncFromDom)
    observer.observe(viewportEl.value, { subtree: true, attributes: true, attributeFilter: ['data-highlighted'] })
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <Select
    :model-value="status"
    :open="open"
    @update:open="open = $event"
    @update:model-value="(v: any) => emit('change', String(v))"
  >
    <SelectTrigger :class="triggerClass">
      <SelectValue />
    </SelectTrigger>
    <SelectContent class="min-w-[104px]">
      <div ref="viewportEl" class="relative" @pointerover="onPointerOver">
        <div
          class="pointer-events-none absolute inset-x-1 top-0 rounded-md bg-zinc-100"
          :style="pillStyle"
          aria-hidden="true"
        />
        <SelectItem
          v-for="opt in OPTIONS"
          :key="opt.value"
          :value="opt.value"
          class="relative z-[1] rounded-md bg-transparent py-2 pl-3 pr-8 text-[13px] text-zinc-700 shadow-none focus:bg-transparent data-[highlighted]:bg-transparent data-[highlighted]:text-zinc-900"
        >
          {{ opt.label }}
        </SelectItem>
      </div>
    </SelectContent>
  </Select>
</template>
