import { listPosts } from '../utils/blog-store'

/** Public blog catalog — published posts only, without article bodies. */
export default defineEventHandler(async () => {
  return listPosts()
})
