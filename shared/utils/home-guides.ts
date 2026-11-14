const guides = {
  en: {
    title: 'Guides & research',
    intro: 'Understand the signals behind your score and what they mean for your next login.',
    read: 'Read guide',
    cards: [
      ['what-is-ip-risk-score', 'Understand your IP risk score', 'Learn how reputation, network type and abuse signals shape your score.'],
      ['why-is-my-ip-blacklisted', 'Is your IP blacklisted?', 'Find the reason behind a listing and the steps to resolve it.'],
      ['why-chatgpt-claude-blocking-your-ip', 'Why ChatGPT and Claude block your IP', 'See which network signals can interrupt access to AI platforms.'],
    ],
  },
  zh: {
    title: '指南与研究',
    intro: '读懂分数背后的信号，为下一次登录做好准备。',
    read: '阅读指南',
    cards: [
      ['what-is-ip-risk-score', '读懂你的 IP 风险分', '了解信誉、网络类型与滥用信号如何影响风险评分。'],
      ['why-is-my-ip-blacklisted', '你的 IP 被拉黑了吗？', '找到被列入黑名单的原因，以及解决问题的步骤。'],
      ['why-chatgpt-claude-blocking-your-ip', '为什么 ChatGPT 和 Claude 会封锁你的 IP', '看看哪些网络信号会影响 AI 平台的访问。'],
    ],
  },
}

// All markup comes from the fixed editorial copy above.
export function renderHomeGuides(locale: string): string {
  const copy = locale === 'zh' ? guides.zh : guides.en
  return '<div class="home-guides-inner"><div class="section-head"><h2 id="guides-title">' + copy.title + '</h2><p>' + copy.intro + '</p></div><div class="home-guides-grid">' + copy.cards.map(([slug, title, description]) => '<a class="home-guide-card" href="/blog/' + slug + '"><h3>' + title + '</h3><p>' + description + '</p><span>' + copy.read + ' <span aria-hidden="true">↗</span></span></a>').join('') + '</div></div>'
}
