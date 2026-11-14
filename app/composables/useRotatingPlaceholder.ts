export function useRotatingPlaceholder(keys: string[]) {
  const { t } = useI18n()
  const index = ref(0)
  const text = computed(() => t(keys[index.value]!))
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => { index.value = (index.value + 1) % keys.length }, 3200)
    }
  })
  onBeforeUnmount(() => { if (timer) clearInterval(timer) })
  return text
}
