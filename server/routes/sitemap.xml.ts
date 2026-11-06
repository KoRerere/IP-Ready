import { buildSitemapXml } from '../utils/sitemap'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return buildSitemapXml()
})
