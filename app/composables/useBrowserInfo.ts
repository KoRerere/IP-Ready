import { parseBrowserInfo } from '#shared/utils/ip-display'

export function useBrowserInfo() {
  const userAgent = ref('')
  const info = computed(() => parseBrowserInfo(userAgent.value))
  onMounted(() => { userAgent.value = navigator.userAgent })
  return { userAgent, browserInfo: info }
}
