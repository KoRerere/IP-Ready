export type BlogFilter = 'all' | 'resources' | 'changelog'
export type CoverVariant = 'window' | 'steps' | 'orbit' | 'tiles'
export type PostStatus = 'draft' | 'published' | 'unpublished'

export interface BlogPostContent {
  title: string
  readTime: string
  author: string
  excerpt: string
  /** Markdown source (source of truth for admin-authored posts). */
  markdown?: string
  /** Rendered article body (semantic HTML). */
  body?: string
}

export interface BlogPost extends BlogPostContent {
  slug: string
  date: string
  category: Exclude<BlogFilter, 'all'> | null
  cover: CoverVariant
  coverImage?: string
  translations?: Partial<Record<'en' | 'zh', Partial<BlogPostContent>>>
  status: PostStatus
  /** Manual position in the blog list (lower comes first). */
  order?: number
}

/** List payloads omit the top-level article body. */
export type BlogPostListItem = Omit<BlogPost, 'body' | 'markdown'>
