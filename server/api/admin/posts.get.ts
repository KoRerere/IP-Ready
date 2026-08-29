import { listPosts } from '../../utils/blog-store'

/** Admin catalog — includes drafts. */
export default defineEventHandler(async () => {
  return listPosts({ includeDrafts: true })
})
