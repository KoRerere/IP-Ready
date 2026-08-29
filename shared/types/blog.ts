export type BlogFilter = 'all' | 'resources' | 'changelog'
export type CoverVariant = 'window' | 'steps' | 'orbit' | 'tiles'
export type PostStatus = 'draft' | 'published' | 'unpublished'

export interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  author: string
  category: Exclude<BlogFilter, 'all'> | null
  cover: CoverVariant
  coverImage?: string
  excerpt: string
  /** Markdown source (source of truth for admin-authored posts). */
  markdown?: string
  /** Rendered article body (semantic HTML). */
  body?: string
  status: PostStatus
  /** Manual position in the blog list (lower comes first). */
  order?: number
}

/** Public list payloads never include the article body. */
export type BlogPostListItem = Omit<BlogPost, 'body' | 'markdown'>
