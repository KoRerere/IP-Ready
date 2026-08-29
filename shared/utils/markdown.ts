/**
 * Minimal Markdown → HTML renderer shared by the admin editor (live preview)
 * and the server (render-on-save). Raw HTML in the source is escaped, so the
 * output is safe to inject with v-html.
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text: string): string {
  let out = escapeHtml(text)
  // code spans first so their content is not further processed
  const codeSpans: string[] = []
  out = out.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${code}</code>`)
    return `\u0000${codeSpans.length - 1}\u0000`
  })
  out = out
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codeSpans[Number(i)] ?? '')
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let inCode = false
  let codeBuffer: string[] = []
  let paragraphBuffer: string[] = []

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }
  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      html.push(`<p>${renderInline(paragraphBuffer.join(' '))}</p>`)
      paragraphBuffer = []
    }
  }

  for (const rawLine of lines) {
    if (inCode) {
      if (/^```/.test(rawLine)) {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
        codeBuffer = []
        inCode = false
      } else {
        codeBuffer.push(rawLine)
      }
      continue
    }

    if (/^```/.test(rawLine)) {
      flushParagraph()
      closeList()
      inCode = true
      continue
    }

    const line = rawLine.trimEnd()

    if (!line.trim()) {
      flushParagraph()
      closeList()
      continue
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      closeList()
      const level = Math.min(heading[1]!.length + 1, 5) // # → h2, ## → h3 …
      html.push(`<h${level}>${renderInline(heading[2]!)}</h${level}>`)
      continue
    }

    if (/^(\-\-\-|\*\*\*|___)\s*$/.test(line)) {
      flushParagraph()
      closeList()
      html.push('<hr>')
      continue
    }

    const quote = /^>\s?(.*)$/.exec(line)
    if (quote) {
      flushParagraph()
      closeList()
      html.push(`<blockquote><p>${renderInline(quote[1]!)}</p></blockquote>`)
      continue
    }

    const ulItem = /^[-*]\s+(.+)$/.exec(line)
    const olItem = /^\d+[.)]\s+(.+)$/.exec(line)
    if (ulItem || olItem) {
      flushParagraph()
      const wanted: 'ul' | 'ol' = ulItem ? 'ul' : 'ol'
      if (listType !== wanted) {
        closeList()
        html.push(`<${wanted}>`)
        listType = wanted
      }
      html.push(`<li>${renderInline((ulItem ?? olItem)![1]!)}</li>`)
      continue
    }

    paragraphBuffer.push(line.trim())
  }

  if (inCode && codeBuffer.length) {
    html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
  }
  flushParagraph()
  closeList()
  return html.join('\n')
}

/** Compute a "N min read" label from markdown/plain text. */
export function computeReadTime(text: string): string {
  const words = text.replace(/[#>*`\[\]()!_-]/g, ' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min read`
}
