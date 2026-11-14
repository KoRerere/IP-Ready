export interface LandingReason {
  title: string
  body: string
}

export interface LandingFaq {
  question: string
  answer: string
}

export interface LandingLink {
  label: string
  href: string
  anchor: string
}

export interface LandingLocaleCopy {
  title: string
  description: string
  h1: string
  sub: string
  detectorCta: string
  whyTitle: string
  reasons: LandingReason[]
  checklistTitle: string
  checklist: string[]
  faqTitle: string
  faq: LandingFaq[]
  linksTitle: string
  links: LandingLink[]
}

export interface LandingPageCopy {
  en: LandingLocaleCopy
  zh: LandingLocaleCopy
}

function field(lines: string[], pattern: RegExp): string {
  const line = lines.find((item) => pattern.test(item)) ?? ''
  return line.replace(pattern, '').trim()
}

function sectionIndex(lines: string[], pattern: RegExp): number {
  return lines.findIndex((line) => pattern.test(line))
}

function sectionLines(lines: string[], start: number, end: number): string[] {
  return lines.slice(start + 1, end < 0 ? lines.length : end)
}

function parseReasons(lines: string[], start: number, end: number): LandingReason[] {
  const result: LandingReason[] = []
  const heading = /^###\s+\d+\.\s+(.+?)\s*$/
  const sectionEnd = end < 0 ? lines.length : end
  for (let index = start + 1; index < sectionEnd; index += 1) {
    const match = heading.exec(lines[index] ?? '')
    if (!match) continue
    let next = sectionEnd
    for (let cursor = index + 1; cursor < sectionEnd; cursor += 1) {
      if (heading.test(lines[cursor] ?? '')) {
        next = cursor
        break
      }
    }
    const body = lines.slice(index + 1, next).filter(Boolean).join(' ')
    result.push({ title: match[1] ?? '', body })
  }
  return result
}

function parseChecklist(lines: string[], start: number, end: number): string[] {
  const result: string[] = []
  for (const line of sectionLines(lines, start, end)) {
    const match = /^\d+\.\s+(.+)$/.exec(line.trim())
    if (match) result.push(match[1] ?? '')
  }
  return result
}

function parseFaq(lines: string[], start: number, end: number): LandingFaq[] {
  const result: LandingFaq[] = []
  let question = ''
  let answer: string[] = []
  const flush = () => {
    if (question && answer.length) result.push({ question, answer: answer.join(' ') })
    question = ''
    answer = []
  }

  for (const rawLine of sectionLines(lines, start, end)) {
    const line = rawLine.trim()
    const match = /^\*\*(.+?)\*\*\s*$/.exec(line)
    if (match) {
      flush()
      question = match[1] ?? ''
    } else if (line && question) {
      answer.push(line)
    }
  }
  flush()
  return result
}

function parseLinks(lines: string[], start: number, end: number): LandingLink[] {
  const tick = String.fromCharCode(96)
  return sectionLines(lines, start, end)
    .filter((line) => /^-\s/.test(line.trim()))
    .map((line) => {
      const label = line.match(/\*\*(.+?)\*\*/)?.[1] ?? ''
      const hrefPart = line.match(/\(\s*([^\)]+)\s*\)/)?.[1] ?? '/'
      const href = hrefPart.replace(new RegExp(tick, 'g'), '').trim()
      const anchorPart = line.split(/anchor:|锚文本[:：]/i)[1] ?? ''
      const anchor = anchorPart.replace(/^[\s"'“「]+|[\s"'”」]+$/g, '').trim()
      return { label, href, anchor: anchor || label }
    })
}

function parseLocale(block: string): LandingLocaleCopy {
  const lines = block.replace(/\r\n?/g, '\n').split('\n').map((line) => line.trimEnd())
  const hero = sectionIndex(lines, /^##\s+Hero\s*$/)
  const why = sectionIndex(lines, /^##\s+(?:Why|为什么)/)
  const checklist = sectionIndex(lines, /^##\s+(?:Self-check checklist|自查清单)/)
  const faq = sectionIndex(lines, /^##\s+###\s+(?:FAQ|常见问题)/)
  const links = sectionIndex(lines, /^##\s+(?:Internal links|内链建议)/)
  const meta = sectionIndex(lines, /^##\s+URL/)
  const metaLines = sectionLines(lines, meta, hero)
  const heroLines = sectionLines(lines, hero, why)

  return {
    title: field(metaLines, /^-\s+\*\*Title[：:]\*\*\s*/),
    description: field(metaLines, /^-\s+\*\*Meta description[：:]\*\*\s*/),
    h1: field(heroLines, /^-\s+\*\*H1[：:]\*\*\s*/),
    sub: field(heroLines, /^-\s+\*\*(?:Sub|副文案)[：:]\*\*\s*/),
    detectorCta: field(heroLines, /^-\s+\*\*(?:CTA under the card|卡片下方 CTA)[：:]\*\*\s*/),
    whyTitle: lines[why]?.replace(/^##\s+/, '').trim() ?? '',
    reasons: parseReasons(lines, why, checklist),
    checklistTitle: lines[checklist]?.replace(/^##\s+/, '').trim() ?? '',
    checklist: parseChecklist(lines, checklist, faq),
    faqTitle: lines[faq]?.replace(/^##\s+###\s+/, '').trim() ?? '',
    faq: parseFaq(lines, faq, links),
    linksTitle: lines[links]?.replace(/^##\s+/, '').trim() ?? '',
    links: parseLinks(lines, links, lines.length),
  }
}

export function parseLandingMarkdown(raw: string): LandingPageCopy {
  const normalized = raw.replace(/\r\n?/g, '\n')
  const zhIndex = normalized.search(/^#{1,2}\s+ZH\s+—/m)
  const enBlock = zhIndex >= 0 ? normalized.slice(0, zhIndex) : normalized
  const zhBlock = zhIndex >= 0 ? normalized.slice(zhIndex) : normalized
  return { en: parseLocale(enBlock), zh: parseLocale(zhBlock) }
}

export function landingInline(value: string): string {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  const tick = String.fromCharCode(96)
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(new RegExp(tick + '([^' + tick + ']+)' + tick, 'g'), '<code>$1</code>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
