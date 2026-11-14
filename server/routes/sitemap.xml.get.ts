import { defineEventHandler, setResponseHeader } from 'h3'
import { listPosts } from '../utils/blog-store'
import { buildSitemap } from '../utils/sitemap'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return buildSitemap(await listPosts())
})
