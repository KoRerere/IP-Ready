import type { BlogPostListItem } from '#shared/types/blog'

export function useBlogLocale() {
  const { locale } = useI18n()

  function localizePost<T extends BlogPostListItem>(post: T): T {
    const translation = locale.value === 'zh' ? post.translations?.zh : undefined
    return translation ? { ...post, ...translation } : post
  }

  function formatDate(date: string): string {
    if (locale.value !== 'zh') return date
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    return match ? `${match[1]}年${Number(match[2])}月${Number(match[3])}日` : date
  }

  function formatReadTime(readTime: string): string {
    return locale.value === 'zh'
      ? readTime.replace(/(\d+)\s*min(?:ute)?s?\s+read/i, '$1 分钟阅读')
      : readTime
  }

  return { localizePost, formatDate, formatReadTime }
}
