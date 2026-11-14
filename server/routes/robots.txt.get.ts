import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return 'User-agent: *\nAllow: /\n\nSitemap: https://ipready.cc/sitemap.xml\n'
})
