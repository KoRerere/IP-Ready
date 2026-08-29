export default defineNuxtPlugin(() => {
  const cookie = useCookie<Locale | null>('ip-ready-locale', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    default: () => null,
  })

  const locale = useState<Locale>('locale', () => (cookie.value === 'zh' ? 'zh' : 'en'))

  watch(locale, (value) => {
    cookie.value = value
  })
})
