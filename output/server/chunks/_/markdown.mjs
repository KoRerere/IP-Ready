function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderInline(text) {
  let out = escapeHtml(text);
  const codeSpans = [];
  out = out.replace(/`([^`]+)`/g, (_m, code) => {
    codeSpans.push(`<code>${code}</code>`);
    return `\0${codeSpans.length - 1}\0`;
  });
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i) => {
    var _a;
    return (_a = codeSpans[Number(i)]) != null ? _a : "";
  });
}
function renderMarkdown(markdown) {
  var _a, _b;
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listType = null;
  let inCode = false;
  let codeBuffer = [];
  let paragraphBuffer = [];
  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };
  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      html.push(`<p>${renderInline(paragraphBuffer.join(" "))}</p>`);
      paragraphBuffer = [];
    }
  };
  const tableCells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const isTableDivider = (line) => {
    const cells = tableCells(line);
    return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const rawLine = lines[lineIndex];
    if (inCode) {
      if (/^```/.test(rawLine)) {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        codeBuffer = [];
        inCode = false;
      } else {
        codeBuffer.push(rawLine);
      }
      continue;
    }
    if (/^```/.test(rawLine)) {
      flushParagraph();
      closeList();
      inCode = true;
      continue;
    }
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }
    const nextLine = (_b = (_a = lines[lineIndex + 1]) == null ? void 0 : _a.trimEnd()) != null ? _b : "";
    if (line.includes("|") && isTableDivider(nextLine)) {
      flushParagraph();
      closeList();
      const headers = tableCells(line);
      const alignments = tableCells(nextLine).map((cell) => {
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.endsWith(":")) return "right";
        return "left";
      });
      const align = (index) => {
        var _a2;
        return ` style="text-align:${(_a2 = alignments[index]) != null ? _a2 : "left"}"`;
      };
      html.push("<table>");
      html.push(`<thead><tr>${headers.map((cell, index) => `<th${align(index)}>${renderInline(cell)}</th>`).join("")}</tr></thead>`);
      html.push("<tbody>");
      lineIndex += 2;
      while (lineIndex < lines.length) {
        const rowLine = lines[lineIndex].trimEnd();
        if (!rowLine.trim() || !rowLine.includes("|")) break;
        const cells = tableCells(rowLine);
        html.push(`<tr>${headers.map((_, index) => {
          var _a2;
          return `<td${align(index)}>${renderInline((_a2 = cells[index]) != null ? _a2 : "")}</td>`;
        }).join("")}</tr>`);
        lineIndex++;
      }
      html.push("</tbody>");
      html.push("</table>");
      lineIndex--;
      continue;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    if (/^(\-\-\-|\*\*\*|___)\s*$/.test(line)) {
      flushParagraph();
      closeList();
      html.push("<hr>");
      continue;
    }
    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushParagraph();
      closeList();
      html.push(`<blockquote><p>${renderInline(quote[1])}</p></blockquote>`);
      continue;
    }
    const ulItem = /^[-*]\s+(.+)$/.exec(line);
    const olItem = /^\d+[.)]\s+(.+)$/.exec(line);
    if (ulItem || olItem) {
      flushParagraph();
      const wanted = ulItem ? "ul" : "ol";
      if (listType !== wanted) {
        closeList();
        html.push(`<${wanted}>`);
        listType = wanted;
      }
      html.push(`<li>${renderInline((ulItem != null ? ulItem : olItem)[1])}</li>`);
      continue;
    }
    paragraphBuffer.push(line.trim());
  }
  if (inCode && codeBuffer.length) {
    html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
  }
  flushParagraph();
  closeList();
  return html.join("\n");
}
function computeReadTime(text) {
  const words = text.replace(/[#>*`\[\]()!_-]/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export { computeReadTime as c, renderMarkdown as r };
//# sourceMappingURL=markdown.mjs.map
