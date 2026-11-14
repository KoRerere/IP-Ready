import { randomUUID } from 'node:crypto'
import type { EventEmitter } from 'node:events'
import type { IncomingMessage } from 'node:http'

// 不依赖 Nitro 自动导入的纯判定模块：nuxt.config.ts（dev 监听器钩子）与 server/utils/local-request.ts 共用同一份判定。
// 放在 server/lib/（不在 Nitro 自动导入扫描范围内），避免同名自动导入重复。

// 包 2（torgloss2-20261114 / tor1114）的本地等价改动：与线上补丁
// （.output/server/chunks/routes/api/ip-check.get.mjs 的 __iprIsLocalRequest）同一判定。
// 只有同时满足以下两条才算「本地请求」：
//   1. Host 是 loopback / *.localhost / 局域网地址（127/8、10/8、172.16/12、192.168/16、169.254/16、::1、0.0.0.0）
//   2. 请求里没有任何代理/CDN 头
// 本地请求返回明确标注的桩数据：不调 IP 供应商（也不调 DeepSeek 分析），不写扫描记录，不消耗任何 key。
const PROXY_HEADERS = ['cf-connecting-ip', 'cf-ray', 'x-forwarded-for', 'x-forwarded-host', 'x-real-ip', 'x-vercel-forwarded-for', 'forwarded']

export function isLocalRequest(headers: Record<string, string | string[] | undefined> | null | undefined): boolean {
  if (!headers || PROXY_HEADERS.some((name) => headers[name])) return false
  let host = String(headers.host || '').trim().toLowerCase()
  if (!host) return false
  host = host.startsWith('[') ? host.slice(1, host.indexOf(']')) : host.replace(/:\d+$/, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1' || host === '0.0.0.0') return true
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!match) return false
  const a = Number(match[1])
  const b = Number(match[2])
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 169 && b === 254)
}

// 包 3（2026-11-14）真机 `nuxt dev` 桩不触发的根因修复：
// Nitro 2.13.4 的 dev server 把每个请求经 httpxy 代理转给 worker 线程（unix socket），代理的 proxyReq 钩子
// 在请求没有 x-forwarded-for 时自动补上 `x-forwarded-for: <客户端 socket 地址>`（另补 x-forwarded-port/proto）。
// worker 里的 handler 因此永远看到 x-forwarded-for，isLocalRequest 恒为 false，桩分支被跳过。
// 修法：在 dev 监听器（Nuxt `listen` 钩子，见 nuxt.config.ts）上，用同一个 isLocalRequest 对「客户端原始请求头」
// 先判定，把结果连同进程级随机 token 写进 DEV_LOCAL_VERDICT_HEADER 再交给 Nitro；worker 只在 dev 下认这个结果。
// 客户端自带的同名头一律先删掉；token 对不上即判非本地。生产构建 import.meta.dev 为 false，判定逐字照旧。
export const DEV_LOCAL_VERDICT_HEADER = 'x-ipready-dev-local-verdict'
const DEV_VERDICT_INSTALLED = Symbol.for('ipready.devLocalVerdict')

export function installDevLocalVerdict(server: EventEmitter) {
  const marked = server as EventEmitter & { [DEV_VERDICT_INSTALLED]?: true }
  if (marked[DEV_VERDICT_INSTALLED]) return // Nuxt 重载时会再次触发 listen 钩子，保证只装一次
  marked[DEV_VERDICT_INSTALLED] = true
  process.env.IPREADY_DEV_LOCAL_TOKEN ||= randomUUID() // 在 Nitro 创建 worker 之前写入，worker 继承 process.env
  server.prependListener('request', (req: IncomingMessage) => {
    delete req.headers[DEV_LOCAL_VERDICT_HEADER]
    const verdict = isLocalRequest(req.headers) ? 'local' : 'remote'
    req.headers[DEV_LOCAL_VERDICT_HEADER] = `${process.env.IPREADY_DEV_LOCAL_TOKEN}:${verdict}`
  })
}
