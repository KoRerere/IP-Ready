import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },
  devServer: { host: '0.0.0.0' },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],
  components: [
    { path: '~/components', ignore: ['**/index.ts'] },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    deepseekApiKey: '',
    deepseekBaseUrl: 'https://api.deepseek.com',
    ipqsApiKey: '',
    iplocateApiKey: '',
    adminPassword: '',
    adminSecret: '',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  typescript: {
    typeCheck: true,
  },
})
