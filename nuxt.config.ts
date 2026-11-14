import tailwindcss from '@tailwindcss/vite'
import { installDevLocalVerdict } from './server/lib/local-request-core'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },
  devServer: { host: '0.0.0.0' },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css', '~/assets/css/mobile-padding.css'],
  components: [
    { path: '~/components', ignore: ['**/index.ts'] },
  ],
  vite: {
    plugins: tailwindcss(),
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
    typeCheck: false,
  },
  hooks: {
    // 包 3：dev 监听器上先按客户端原始请求头判定本地桩（Nitro dev 代理会补 x-forwarded-for），详见 server/lib/local-request-core.ts
    listen(server) {
      installDevLocalVerdict(server)
    },
  },
})
