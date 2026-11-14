<script setup lang="ts">
const { locale } = useI18n()
const CLAUDE_LOGO_PATH = 'M5.31658 15.6254L9.64325 13.199L9.71658 12.9882L9.64325 12.8708H9.43333L8.70917 12.8268L6.236 12.7599L4.09192 12.671L2.01475 12.5592L1.49133 12.4483L1 11.802L1.05042 11.4793L1.49042 11.1851L2.11925 11.2401L3.51258 11.3345L5.60075 11.4793L7.11508 11.5683L9.36 11.802H9.71658L9.767 11.6581L9.64417 11.5683L9.54975 11.4793L7.38825 10.0163L5.04892 8.469L3.82425 7.578L3.16058 7.12792L2.82692 6.70442L2.68208 5.78042L3.28342 5.11858L4.091 5.17358L4.29725 5.2295L5.11583 5.85833L6.86483 7.21133L9.14825 8.89158L9.48283 9.17025L9.61575 9.07583L9.63317 9.00892L9.48283 8.75775L8.24075 6.51558L6.91525 4.23308L6.32492 3.28708L6.16908 2.71967C6.10971 2.50173 6.07768 2.27726 6.07375 2.05142L6.75942 1.12283L7.138 1L8.051 1.12283L8.436 1.4565L9.00433 2.75267L9.92283 4.79592L11.3482 7.57342L11.7662 8.39658L11.989 9.15925L12.0724 9.393H12.2173V9.25917L12.3346 7.69533L12.5518 5.77492L12.7627 3.3045L12.836 2.60783L13.1807 1.77367L13.8654 1.32267L14.4008 1.57933L14.8408 2.20725L14.7793 2.61425L14.5172 4.311L14.0048 6.97208L13.6711 8.75225H13.8654L14.0882 8.53042L14.9911 7.33325L16.5054 5.44125L17.1746 4.68958L17.9538 3.86092L18.4552 3.46583H19.4021L20.0987 4.50075L19.7871 5.56958L18.8118 6.80433L18.0042 7.85117L16.8455 9.4095L16.1213 10.6562L16.1883 10.757L16.3606 10.7387L18.9786 10.1832L20.393 9.9265L22.0806 9.63775L22.8442 9.99342L22.9276 10.3555L22.6269 11.0953L20.822 11.5407L18.7054 11.9643L15.553 12.7095L15.5145 12.737L15.5594 12.7929L16.9793 12.9268L17.5862 12.9598H19.073L21.8413 13.166L22.5655 13.6445L23 14.2293L22.9276 14.6739L21.8138 15.2423L16.8006 14.0515L15.5979 13.7499H15.4311V13.8507L16.433 14.8298L18.2718 16.4889L20.5718 18.6248L20.6882 19.1546L20.393 19.5717L20.0813 19.5268L18.0601 18.0078L17.28 17.3231L15.5145 15.8381H15.3972V15.9939L15.8042 16.5888L17.9538 19.8164L18.0656 20.8064L17.9097 21.13L17.3524 21.3253L16.7401 21.2134L15.4806 19.4488L14.1835 17.4624L13.1358 15.6813L13.0074 15.7547L12.3896 22.4042L12.0999 22.7433L11.4317 23L10.8752 22.5774L10.5801 21.8927L10.8752 20.5397L11.2318 18.776L11.5206 17.3735L11.7828 15.6318L11.9386 15.0525L11.9276 15.014L11.7993 15.0305L10.4848 16.8336L8.48642 19.5332L6.90425 21.2244L6.52475 21.3748L5.8675 21.0356L5.92892 20.4288L6.2965 19.8888L8.4855 17.1058L9.8055 15.3807L10.658 14.3852L10.6525 14.2403H10.6021L4.78767 18.0133L3.75183 18.1472L3.30542 17.7292L3.36133 17.0453L3.57308 16.8226L5.32208 15.6199L5.31658 15.6254Z'
const openFaq = ref<number | null>(0)
// lucide-style stroke icons for the five "why flagged" cards, in reason order
// one-row reasons carousel: arrows scroll by one card, and grey out at either end
const reasonTrack = ref<HTMLElement | null>(null)
const reasonCanPrev = ref(false)
const reasonCanNext = ref(true)
function updateReasonNav() {
  const el = reasonTrack.value
  if (!el) return
  reasonCanPrev.value = el.scrollLeft > 4
  reasonCanNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scrollReasons(dir: 1 | -1) {
  const el = reasonTrack.value
  const card = el?.querySelector<HTMLElement>('.gpt-reason')
  if (!el || !card) return
  el.scrollBy({ left: dir * (card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0)), behavior: 'smooth' })
}
onMounted(() => { updateReasonNav(); window.addEventListener('resize', updateReasonNav, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('resize', updateReasonNav))
// closing card: logo, headline and subtitle rotate together through this page's platform, then the other four landing pages
const closeIndex = ref(0)
let closeTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  closeTimer = setInterval(() => { closeIndex.value = (closeIndex.value + 1) % copy.value.closeSlides.length }, 3600)
})
onBeforeUnmount(() => clearInterval(closeTimer))
const closePrev = computed(() => (closeIndex.value + copy.value.closeSlides.length - 1) % copy.value.closeSlides.length)
const closeState = (i: number) => i === closeIndex.value ? 'is-active' : i === closePrev.value ? 'is-prev' : ''
const closeTitleParts = (title: string) => title.split(/(ChatGPT|Claude|Amazon|eBay|Binance)/g)
const REASON_ICONS = [
  'M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z M6 6h.01 M6 18h.01',
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z M12 8v4 M12 16h.01',
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16 M8 16H3v5',
]
const content = {
  en: {
    title: "Claude IP Blocked / Signup Failed? Free IP Check — IP Ready",
    description: `Claude signup failing, login stuck on verification, or account flagged soon after registration? Check the 12 network signals behind your connection — proxy/VPN detection, blacklist status, ASN reputation — and get a plain verdict for Claude before you sign up. Free, no signup.`,
    h1: 'Claude IP Blocked? Signup Failing? Check Your IP First.',
    sub: `Claude scores your connection at signup, before your first message. Check the same signals first and get a clear verdict before you sign in.`,
    after: `That's your connection as platforms see it. The rest of this page explains what moves the verdict.`,
    viewpoint: `Getting Connected Isn't the Same as Being Trusted`,
    viewpointBody: `A working VPN proves little. Claude cares what your IP is: home or datacenter, yours alone or shared, clean or flagged. Connection is a network question; trust is a reputation question. This page checks trust.`,
    system: 'One Check, Run the Way Platforms Run It', intro: `Four layers, one verdict — here's what the checker reads in your connection.`,
    layers: [
      ['12 Risk Signals, Not One Guess', `ISP and ASN, network type, DNS and geolocation — the basic identity of your connection, assembled the way a platform's risk stack sees it.`],
      ['Proxy, VPN and Tor Detection', 'Known VPN and proxy exits are flagged on sight — and a datacenter IP that behaves like an exit is marked as a suspected exit even when it appears on no list.'],
      ['Blacklists and Abuse History', "Your address is checked against blacklist and abuse feeds. IPs are recycled; a previous user's history can follow the address long after they've moved on."],
      ['A Verdict for Claude, Not Just a Number', 'Every check ends in a per-platform readiness verdict with the reasons behind it — so you know whether Claude is likely to let you sign up, challenge you, or turn you away, and why.'],
    ],
    why: 'Why Claude Flags an IP', whySub: `Many Claude accounts are stopped at signup, before a single chat. These are the five network signals Claude's risk checks weigh first.`, reasons: [
      ['Datacenter & Hosting IPs', 'A hosting-range IP creating a brand-new account is one of the riskiest combinations there is. Claude treats cloud and datacenter traffic as automated by default — even when a real person is behind it.'],
      ['Shared VPN & Proxy Exits', "A popular exit serves thousands of users at once. If a few of them abused accounts or ran automation, the exit's reputation drops for everyone on it. You inherit strangers' history."],
      ['Blacklist & Abuse History', 'Offices, dorms and carrier NAT pools put many users behind one address. If that IP carries abuse reports, a fresh Claude signup from it can inherit the suspicion.'],
      ['Unsupported or Mismatched Region', `Claude is only offered in a list of supported countries. An IP that geolocates outside it is stopped at signup — and account country, IP location and timezone disagreeing is a classic anomaly signal.`],
      ['IP Changes Across Sessions', 'Signing up in one country, logging in from another and hopping VPN servers in between reads like account sharing or takeover to automated defenses. Claude accounts fare best on one stable connection.'],
    ],
    reasonTags: ['Network Type', 'Shared Exits', 'Blacklists', 'Geolocation', 'Session'],
    stats: [{ value: 12, label: 'Risk signals analyzed' }, { value: 'Live', label: 'Real-time results' }, { value: 5, label: 'Platforms evaluated' }, { value: 1, label: 'Clear verdict' }],
    links: [
      ['Why ChatGPT and Claude Block Your IP', '/blog/why-chatgpt-claude-blocking-your-ip', 'Datacenter ranges, shared exits, location: the signals AI platforms weigh when scoring your connection.'],
      ['What Is an IP Risk Score?', '/blog/what-is-ip-risk-score', 'What goes into a risk score, what the numbers mean, and how it decides whether a platform lets you in.'],
      ['Why Is My IP Blacklisted?', '/blog/why-is-my-ip-blacklisted', 'Why IPs land on blocklists, how to see which lists carry your address, and how to request removal.'],
    ],
    faqHeading: 'FAQ', faq: [
      ['Why does my Claude signup fail, or my account get flagged or banned soon after?', "Unexplained signup failures are often a decision about your connection, not you. Datacenter IPs, shared VPN exits, unsupported IP locations and addresses with abuse history are the usual triggers. Run the free check above to see which your IP carries — for an account that's already restricted, contact Anthropic support."],
      ['Can a VPN cause Claude to block me?', "Yes. A VPN doesn't hide your network type — it replaces it with the VPN's. If the exit is a flagged datacenter range or is shared with flagged users, Claude may challenge it more than your home connection. A VPN also can't fix a region problem."],
      ["claude.ai says it's not available in my region, but I'm in a supported country. Why?", "Usually a geolocation mismatch: your exit IP resolves to a different country than the one you're actually in — common with VPNs and some mobile carriers. Check the location your IP reports above, and use a connection that resolves to your real region."],
      ['What Safety Score is safe for Claude?', "There's no official cutoff — Anthropic doesn't publish one. As a working guide, a high Safety Score with no proxy/VPN detection and no blacklist hits behaves like an ordinary home connection. Challenges at signup and login typically start as the score drops, especially when the network type reads datacenter or hosting."],
    ], closeTitle: 'Check Before You Sign In', closeEyebrow: 'Free for ChatGPT, Claude, Amazon, eBay & Binance', closeSlides: [
      { logo: 'claude', title: 'Know If Claude Will Trust Your Connection.', sub: "Datacenter ranges and shared VPN exits are the first things Claude's checks catch. See what your IP carries before you start a session." },
      { logo: 'chatgpt', title: "Don't Guess Which Side of ChatGPT's Risk Line You're On.", sub: 'Twelve network signals, one plain verdict. Know whether ChatGPT will let you in before you sign in. Free, no signup.' },
      { logo: 'amazon', title: 'Make Sure Amazon Sees a Clean, Trusted IP.', sub: 'Flagged or shared IPs can trigger extra verification on Amazon. Check your network type and reputation before you log in.' },
      { logo: 'ebay', title: 'Sign In to eBay Without the Extra Checks.', sub: 'Proxy exits and blacklisted addresses are common triggers for eBay security holds. See where your IP stands first.' },
      { logo: 'binance', title: 'Check Your IP Before Binance Does at Login.', sub: 'Exchanges check location, VPN use and IP reputation at login. See what Binance sees in your connection, in seconds.' },
    ], cta: 'Check My IP',
  },
  zh: {
    title: 'Claude 注册不了 / IP 被拦？免费检测你的 IP 安全评分 — IP Ready',
    description: 'Claude 注册失败、登录反复验证，或者账号刚建好就被标记？免费检测你连接背后的 12 个网络信号——代理/VPN 识别、黑名单状态、ASN 信誉——注册之前，先拿到针对 Claude 的明确结论。完全免费，无需注册。',
    h1: 'Claude 注册不了？IP 被拦？先查你的 IP。',
    sub: 'Claude 在你发出第一条消息之前，注册那一步就已经给你的连接打过分了。登录之前，先查一遍同样的信号，拿到明确结论。',
    after: '这就是平台眼中你的连接。下面把结论背后的原因讲清楚。', viewpoint: '连得上，不等于被信任',
    viewpointBody: 'VPN 连得上，证明不了什么。Claude 看的是你的 IP：家庭还是机房，独享还是共用，干净还是有前科。连通是网络问题，信任是信誉问题，这一页查的是信任。',
    system: '一次检测，按平台看 IP 的方式来查', intro: '四层信号，一个结论——检测器读的是你连接里的这些东西。', layers: [
      ['12 项风险信号，不靠猜', 'ISP 与 ASN、网络类型、DNS 与地理位置——你这条连接的基本身份，按平台风控拼凑它的同款方式组装出来。'],
      ['代理 / VPN / Tor 识别', '已知的 VPN 与代理出口会被直接标记；而一个行为像出口的机房 IP，即使不在任何名单上，也会被标为「疑似出口」。'],
      ['黑名单与滥用历史', '你的地址会被拿去比对黑名单与滥用数据库。IP 是循环使用的，上一个用户的历史，可能在这个地址上留很久。'],
      ['给 Claude 的结论，不只是一个数字', '每次检测最后都落到逐平台的就绪度结论，并附上理由——Claude 大概率会放行注册、会验证、还是会拦下，以及为什么。'],
    ], why: '为什么 Claude 会拦一个 IP', whySub: '很多 Claude 账号在注册这一步就被拦下，一句话都还没聊。下面是 Claude 风控最先看的五类网络信号。', reasons: [
      ['机房和托管 IP 段', '「托管机房 IP + 全新注册的账号」是风险最高的组合之一。Claude 默认把云服务器和机房段的流量当成自动化流量——哪怕背后坐的是真人。'],
      ['多人共用的 VPN / 代理出口', '热门出口同时被成千上万个用户使用。只要其中一小部分滥用过账号或跑过自动化，这个出口的信誉就被所有人一起拖下水。你在替陌生人的历史买单。'],
      ['IP 黑名单与滥用历史', '办公室、宿舍、运营商级 NAT 会把很多人塞在同一个地址后面。如果这个 IP 带着滥用记录，从它发起的新 Claude 注册就可能一并被怀疑。'],
      ['地区不支持或对不上', 'Claude 只在官方支持的国家和地区提供服务。IP 解析到名单之外，注册直接被挡；账号国家、IP 地理位置、设备时区三者对不上，也是最经典的异常信号。'],
      ['跨会话频繁换 IP', '在一个国家注册、换个国家登录、中间还轮换 VPN 节点，在自动防护眼里很像账号共享或被盗。Claude 账号最稳的状态，是长期用一条稳定的连接。'],
    ], reasonTags: ['网络类型', '共享出口', '黑名单', '地理位置', '会话'], stats: [{ value: 12, label: '风险信号' }, { value: '实时', label: '检测结果' }, { value: 5, label: '评估平台' }, { value: 1, label: '明确结论' }], links: [
      ['为什么 ChatGPT 和 Claude 会封你的 IP', '/blog/why-chatgpt-claude-blocking-your-ip', '从机房 IP、共享出口到地理位置，拆解 AI 平台风控给你的连接打分时看的几项信号。'],
      ['IP 风险分是什么', '/blog/what-is-ip-risk-score', '风险分由哪些信号组成、分数高低意味着什么，以及它和平台最终放不放行之间的关系。'],
      ['为什么我的 IP 进了黑名单', '/blog/why-is-my-ip-blacklisted', 'IP 被列入黑名单的常见原因，如何查你的地址在哪些名单上，以及怎么申请移除。'],
    ], faqHeading: '常见问题', faq: [
      ['为什么 Claude 注册总失败，或者账号刚建好就被标记，甚至直接封号？', '没有明确理由的注册失败，很多时候是风控在给你的连接打分，而不是针对你本人。机房 IP、共用 VPN 出口、不支持的 IP 地区、带滥用历史的地址是最常见的触发点。跑一遍上面的免费检测就能看到你中了哪几条；账号已经受限的，请联系 Anthropic 官方支持。'],
      ['用 VPN 会导致 Claude 拦我吗？', '会。VPN 并不会隐藏你的网络类型，只是把它换成了 VPN 出口的类型。如果出口是被标记过的机房段，或者和被标记的用户共用，Claude 对它的验证反而可能比你的家庭宽带更严。VPN 也解决不了地区问题。'],
      ['我明明在支持的地区，为什么 claude.ai 提示不可用？', '多半是地理位置对不上：你的出口 IP 被解析到了另一个国家（VPN 和部分移动网络很常见）。先看上面检测出的 IP 所在地，再换一条解析到你真实所在地区的连接。'],
      ['安全评分要多少，对 Claude 才算安全？', '没有官方分数线——Anthropic 没有公布过。经验上：安全评分高、没有代理/VPN 检出、没有黑名单记录的 IP，表现和普通家庭连接无异；分数往下掉、再加上网络类型显示为机房或托管，注册和登录时的验证通常就是从这里开始的。'],
    ], closeTitle: '登录之前，先查一遍', closeEyebrow: '免费检测 ChatGPT、Claude、Amazon、eBay、Binance', closeSlides: [
      { logo: 'claude', title: '登录之前，先确认 Claude 会不会信任你的连接。', sub: '机房 IP 段和共用 VPN 出口，是 Claude 风控最先拦下的两类连接。开始对话之前，先看看你的 IP 带着什么记录。' },
      { logo: 'chatgpt', title: '别再靠猜了：你的 IP 到底落在 ChatGPT 风控线的哪一边？', sub: '12 项网络信号，一个明确结论。登录之前，就知道 ChatGPT 会不会放行你。免费，无需注册。' },
      { logo: 'amazon', title: '登录之前，确认 Amazon 看到的是一条干净的连接。', sub: '被标记或共用的 IP，可能触发 Amazon 的额外验证。登录之前，先查网络类型和 IP 信誉。' },
      { logo: 'ebay', title: '让 eBay 少弹几次安全验证，先从你的 IP 查起。', sub: '代理出口和进了黑名单的地址，是 eBay 安全审核的常见触发点。先看看你的 IP 处在什么位置。' },
      { logo: 'binance', title: '在 Binance 检查你之前，先自己查一遍你的 IP。', sub: '交易所登录时会检查地理位置、VPN 使用和 IP 信誉。几秒钟，看清 Binance 眼中的你的连接。' },
    ], cta: '检测我的 IP',
  },
}
const copy = computed(() => content[locale.value === 'zh' ? 'zh' : 'en'])
// split the title after its question mark so desktop shows question / call-to-action on two lines
const h1Parts = computed(() => { const m = copy.value.h1.match(/^(.*?[?？])\s*(.*)$/); return m ? [m[1]!, m[2]!] : [copy.value.h1, ''] })
// clicking the logo badge replays its load spin
function spinBadge(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.animation = 'none'
  void el.offsetWidth // reflow so the animation restarts
  el.style.animation = ''
}
const social = computed(() => siteSocialMeta({
  path: '/claude-ip-check',
  title: copy.value.title,
  description: copy.value.description,
}))
useHead(() => ({
  title: copy.value.title,
  meta: [
    { name: 'description', content: copy.value.description },
    ...social.value.meta,
  ],
  link: [
    ...social.value.link,
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap' },
  ],
  script: [{
    key: 'claude-faq-jsonld',
    type: 'application/ld+json' as 'application/json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.value.faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    }),
  }],
}))
</script>

<template>
  <div class="gpt-page">
    <AppHeader />
    <main>
      <section class="gpt-hero">
        <div class="gpt-hero-base" aria-hidden="true"></div>
        <div class="gpt-hero-flow" aria-hidden="true"><span></span><span></span><span></span></div>
        <h1><span class="gpt-h1-badge" aria-hidden="true" @click="spinBadge"><svg class="gpt-h1-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path :d="CLAUDE_LOGO_PATH" fill="#D97757" /></svg></span>{{ h1Parts[0] }}<template v-if="h1Parts[1]"><br class="gpt-h1-br" />{{ (locale === 'zh' ? '' : ' ') + h1Parts[1] }}</template></h1>
        <p class="gpt-intro">{{ copy.sub }}</p>
        <div class="gpt-preview"><ClaudeMock :lang="locale === 'zh' ? 'zh' : 'en'" :logo-path="CLAUDE_LOGO_PATH" /></div>
      </section>
      <section class="gpt-viewpoint gpt-section">
        <div class="ipr-landing-container gpt-trust-layout">
          <div class="gpt-trust-copy"><h2>{{ copy.viewpoint }}</h2><p>{{ copy.viewpointBody }}</p></div>
          <figure class="gpt-trust-visual"><TrustCardVisual :lang="locale === 'zh' ? 'zh' : 'en'" /></figure>
        </div>
      </section>
      <section class="gpt-section gpt-system">
        <div class="ipr-landing-container">
          <div class="gpt-heading"><h2>{{ copy.system }}</h2><p>{{ copy.intro }}</p></div>
          <div class="gpt-system-layout">
            <figure class="gpt-system-visual"><RiskScoreVisual :lang="locale === 'zh' ? 'zh' : 'en'" /></figure>
            <div class="gpt-grid"><article v-for="item in copy.layers" :key="item[0]" class="gpt-card"><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div>
          </div>
        </div>
      </section>
      <section class="gpt-section gpt-why"><div class="ipr-landing-container"><div class="gpt-heading"><h2>{{ copy.why }}</h2><p>{{ copy.whySub }}</p></div><div ref="reasonTrack" class="gpt-reasons" @scroll.passive="updateReasonNav"><article v-for="(item, i) in copy.reasons" :key="item[0]" class="gpt-reason"><span class="gpt-reason-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path :d="REASON_ICONS[i]" /></svg></span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><span class="gpt-reason-tag">{{ copy.reasonTags[i] }}</span></article></div><div class="gpt-reason-nav"><button type="button" :disabled="!reasonCanPrev" :aria-label="locale === 'zh' ? '上一张' : 'Previous'" @click="scrollReasons(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg></button><button type="button" :disabled="!reasonCanNext" :aria-label="locale === 'zh' ? '下一张' : 'Next'" @click="scrollReasons(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg></button></div></div></section>
      <section class="gpt-section"><div class="ipr-landing-container"><MetricStrip :items="copy.stats" /><div class="gpt-links"><a v-for="item in copy.links" :key="item[1]" :href="item[1]"><img class="gpt-link-cover" :src="`/blog-covers/cover-${item[1].split('/').pop()}.webp`" alt="" width="1600" height="1072" loading="lazy" decoding="async" /><strong>{{ item[0] }}</strong><small>{{ item[2] }}</small></a></div></div></section>
      <div class="gpt-faq-wrap">
        <section class="faq-section" id="faq">
          <div class="faq-card">
            <h2>{{ copy.faqHeading }}</h2>
            <div class="faq-list">
              <article v-for="(item, i) in copy.faq" :key="item[0]" class="faq-item" :class="{ active: openFaq === i }">
                <button type="button" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? null : i"><span>{{ item[0] }}</span><CurrentIcon class="faq-toggle-icon faq-plus-icon" src="/assets/figma/imgVector.svg" /></button>
                <div class="faq-answer"><p>{{ item[1] }}</p></div>
              </article>
            </div>
          </div>
        </section>
      </div>
      <section class="gpt-close">
        <div class="ipr-landing-container">
          <div class="gpt-heading gpt-close-head"><h2>{{ copy.closeTitle }}</h2></div>
          <div class="gpt-close-card">
            <div class="gpt-close-mesh" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
            <div class="gpt-close-glass">
              <p class="gpt-close-eyebrow">{{ copy.closeEyebrow }}</p>
              <svg class="gpt-close-quote" viewBox="0 0 30 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 24V13.5C0 6.2 3.6 1.7 10.8 0l1.6 3.4C8.6 4.8 6.8 7.4 6.6 11H12v13H0Zm18 0V13.5C18 6.2 21.6 1.7 28.8 0l1.6 3.4C26.6 4.8 24.8 7.4 24.6 11H30v13H18Z" /></svg>
              <div class="gpt-close-rotor gpt-close-titles">
                <h2 v-for="(slide, i) in copy.closeSlides" :key="slide.logo" :class="closeState(i)" :aria-hidden="i !== closeIndex"><template v-for="(part, partIndex) in closeTitleParts(slide.title)" :key="partIndex"><span v-if="partIndex % 2" class="gpt-close-brand">{{ part }}</span><template v-else>{{ part }}</template></template></h2>
              </div>
              <div class="gpt-close-rotor gpt-close-subs">
                <p v-for="(slide, i) in copy.closeSlides" :key="slide.logo" class="gpt-close-sub" :class="closeState(i)" :aria-hidden="i !== closeIndex">{{ slide.sub }}</p>
              </div>
              <a href="/check">{{ copy.cta }} <span aria-hidden="true">↗</span></a>
            </div>
            <div class="gpt-close-mark gpt-close-rotor" aria-hidden="true">
              <span v-for="(slide, i) in copy.closeSlides" :key="slide.logo" class="gpt-close-logo" :class="closeState(i)" :style="{ '--logo': `url(/assets/platform/${slide.logo}.svg)` }"></span>
            </div>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.gpt-page { overflow-x: clip; background: #fff; color: #202527; }
.gpt-hero { position: relative; isolation: isolate; }
.gpt-hero-base { position: absolute; z-index: -3; top: -64px; bottom: 0; left: 50%; width: 100vw; margin-left: -50vw; pointer-events: none; background: linear-gradient(110deg, #fefbf9, #fdf9f6); }
.gpt-hero::before, .gpt-hero-flow { position: absolute; z-index: -1; top: -64px; bottom: 0; left: 50%; width: 100vw; margin-left: -50vw; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 17%, rgba(0,0,0,.22) 32%, transparent 44%); mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 17%, rgba(0,0,0,.22) 32%, transparent 44%); }
.gpt-hero::before, .gpt-hero::after { content: ''; }
.gpt-hero::before, .gpt-hero::after { z-index: -2; } /* peach / sand / terracotta base under the moving white light */
.gpt-hero::after { position: absolute; z-index: -2; top: -64px; bottom: 0; left: 50%; width: 120vw; margin-left: -60vw; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 17%, rgba(0,0,0,.22) 32%, transparent 44%); mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 17%, rgba(0,0,0,.22) 32%, transparent 44%); background: radial-gradient(30% 50% at 82% 0%, rgba(229,179,185,.22), rgba(229,179,185,0) 72%), radial-gradient(40% 60% at 72% 0%, rgba(229,179,185,.16), rgba(229,179,185,0) 72%), radial-gradient(36% 58% at 20% 8%, rgba(235,181,140,.27), rgba(235,181,140,0) 72%), radial-gradient(34% 50% at 60% 30%, rgba(240,186,160,.12), rgba(240,186,160,0) 70%); animation: gpt-hero-drift 16s ease-in-out infinite alternate; }
@keyframes gpt-hero-drift { 0% { transform: translate3d(-5%, 0, 0); } 100% { transform: translate3d(5%, 0, 0); } }
.gpt-hero-flow { z-index: -1; }
.gpt-hero::before { background: linear-gradient(100deg, rgb(253,246,241) 0%, rgb(253,248,244) 35%, rgb(252,245,243) 70%, rgb(251,243,244) 100%); animation: gpt-hero-breathe 9s ease-in-out infinite; }
@keyframes gpt-hero-breathe { 0%, 100% { opacity: .8; } 50% { opacity: 1; } }
.gpt-hero-flow { overflow: hidden; background: radial-gradient(circle, rgba(255,255,255,.6) 1.1px, transparent 1.6px) 0 0 / 32px 32px; } /* static white dot grid over the color wash */
.gpt-hero-flow span { position: absolute; border-radius: 50%; will-change: transform; }
.gpt-hero-flow span:nth-child(1) { top: -18%; left: -8%; width: 58vw; height: 58vw; max-height: 900px; background: radial-gradient(closest-side, rgba(255,255,255,.45), rgba(255,255,255,0)); animation: gpt-flow-a 19s ease-in-out infinite alternate; }
.gpt-hero-flow span:nth-child(2) { top: -24%; right: -10%; width: 54vw; height: 54vw; max-height: 860px; background: radial-gradient(closest-side, rgba(255,255,255,.4), rgba(255,255,255,0)); animation: gpt-flow-b 23s ease-in-out infinite alternate; }
.gpt-hero-flow span:nth-child(3) { top: 6%; left: 30%; width: 44vw; height: 44vw; max-height: 700px; background: radial-gradient(closest-side, rgba(255,255,255,.35), rgba(255,255,255,0)); animation: gpt-flow-c 27s ease-in-out infinite alternate; }
@keyframes gpt-flow-a { 0% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(22vw, 6%, 0) scale(1.12); } 100% { transform: translate3d(8vw, -4%, 0) scale(.94); } }
@keyframes gpt-flow-b { 0% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(-20vw, 8%, 0) scale(.9); } 100% { transform: translate3d(-6vw, -2%, 0) scale(1.1); } }
@keyframes gpt-flow-c { 0% { transform: translate3d(0, 0, 0) scale(.95); } 50% { transform: translate3d(-16vw, -10%, 0) scale(1.15); } 100% { transform: translate3d(14vw, 4%, 0) scale(1); } }
@media (max-width: 760px) { .gpt-hero-flow span:nth-child(1) { width: 120vw; height: 120vw; } .gpt-hero-flow span:nth-child(2) { width: 110vw; height: 110vw; } .gpt-hero-flow span:nth-child(3) { top: 22%; left: 0; width: 100vw; height: 100vw; } }
@media (prefers-reduced-motion: reduce) { .gpt-hero::before, .gpt-hero::after, .gpt-hero-flow span { animation: none; } }
.gpt-hero { max-width: 1200px; margin: 0 auto; padding: 88px 32px 0; text-align: center; }
h1, h2, h3, p { margin: 0; }
h1 { max-width: 1040px; margin: 0 auto; color: var(--ink); font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: min(44px, 4.25vw); font-weight: 600; word-break: keep-all; line-height: 1.32; }
.gpt-h1-badge { cursor: pointer; user-select: none; display: inline-flex; width: 1.2em; height: 1.2em; align-items: center; justify-content: center; margin: 0 .26em 0 -1.46em; border: 1px solid #cfd6d3; border-radius: .24em; background: #fff; vertical-align: -.102em; transform: rotate(8deg); animation: gpt-logo-spin 1.56s 1; }
h1 { padding-inline: 1.46em; }
@media (max-width: 760px) { h1 { padding-inline: 0; } .gpt-h1-badge { display: flex; margin: 0 auto .32em; } }
.gpt-h1-logo { display: block; width: .94em; height: .94em; }
/* plays once on load: small wind-up, clockwise spin that overshoots, decaying wobble back to the 8° rest angle */
@keyframes gpt-logo-spin {
  0% { transform: rotate(8deg); animation-timing-function: cubic-bezier(.33, 0, .67, 1); }
  11.5% { transform: rotate(-6deg); animation-timing-function: cubic-bezier(.5, 0, .2, 1); }
  50% { transform: rotate(394deg); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  63.5% { transform: rotate(356deg); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  75% { transform: rotate(375deg); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  84.5% { transform: rotate(365deg); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  92.5% { transform: rotate(369.5deg); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  100% { transform: rotate(368deg); }
}
@media (prefers-reduced-motion: reduce) { .gpt-h1-badge { animation: none; } }
.gpt-intro { max-width: 980px; text-wrap: balance; margin: 18px auto 0; color: #404040; font-size: 14.5px; line-height: 1.5; }
/* Preserve the intentional lower-third crop behind the next section. */
.gpt-hero + .gpt-section { position: relative; z-index: 1; }
.gpt-preview { --cgm-ratio: .625; max-width: 1120px; margin: 88px auto calc(min(1120px, 100%) * var(--cgm-ratio) / -3); }
.gpt-section { padding: 112px 32px; }
.ipr-landing-container { max-width: 1120px; margin: 0 auto; }
.gpt-narrow { max-width: 840px; margin: 0 auto; }
/* second-level headings: same scale as the Resources page (.rs-title / .rs-sub) */
.gpt-section h2, .gpt-close h2 { color: var(--ink); font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 38px; font-weight: 600; line-height: 1.1; text-wrap: balance; }
.gpt-viewpoint { padding-block: 128px 16px; background: #fff; }
@media (max-width: 760px) { .gpt-viewpoint.gpt-section { padding-block: 88px 16px; } }
.gpt-viewpoint p { margin-top: 18px; color: #59645e; font-size: 15px; line-height: 1.7; }
.gpt-trust-layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: center; gap: 64px; }
.gpt-trust-copy { min-width: 0; }
.gpt-trust-visual { width: 100%; margin: 0; overflow: hidden; border-radius: 20px; aspect-ratio: 16 / 10; }
.gpt-trust-visual { background: #fafafa; }
.gpt-viewpoint .gpt-trust-visual img { height: 100%; object-fit: cover; }
.gpt-trust-visual img, .gpt-system-visual img { display: block; width: 100%; height: auto; object-fit: cover; }
.gpt-system-visual img { height: 100%; }
.gpt-system-layout { display: grid; grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr); align-items: stretch; gap: 16px; }
.gpt-system-visual { display: flex; min-width: 0; align-items: center; margin: 0; overflow: hidden; border-radius: 20px; background: #fafafa; }
.gpt-system .gpt-card { padding: 24px; }
.gpt-system .gpt-card h3 { margin-top: 0; font-size: 18px; font-weight: 500; }
.gpt-heading { max-width: 960px; margin: 0 auto 52px; text-align: center; }
.gpt-heading p { max-width: 750px; margin: 8px auto 0; color: var(--muted-ink); font-size: 15.5px; line-height: 1.6; text-wrap: pretty; }
.gpt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.gpt-card { min-width: 0; padding: 30px; border-radius: 14px; background: #fafafa; }
.gpt-num { color: #c2613f; font-size: 12px; font-weight: 700; }
.gpt-card h3, .gpt-reason h3 { margin-top: 18px; color: #171717; font-size: 20px; font-weight: 600; line-height: 1.35; }
.gpt-card p, .gpt-reason p { margin-top: 6px; color: #68736d; font-size: 14px; line-height: 1.55; }
.gpt-why { background: #fafbfa; }
.gpt-why.gpt-section { padding-block: 80px; }
@media (max-width: 760px) { .gpt-why.gpt-section { padding-block: 56px; } }
/* GitBook-style feature cards in one horizontal row: starts at the container's left edge, bleeds to both viewport edges (no clipping at the container's left when scrolled); padding/scroll-padding keep card 1 and the snap points on the container's left edge; swipe/scroll or use the arrows */
.gpt-reasons { display: flex; gap: 12px; --gpt-gutter: max(32px, calc(50vw - 560px)); margin-inline: calc(-1 * var(--gpt-gutter)); padding: 2px var(--gpt-gutter) 4px; scroll-padding-inline: var(--gpt-gutter); overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none; }
.gpt-reasons::-webkit-scrollbar { display: none; }
.gpt-reason { display: flex; flex: 0 0 360px; min-width: 0; flex-direction: column; padding: 28px; border: 1px solid #ebebeb; border-radius: 20px; background: #fff; scroll-snap-align: start; }
.gpt-reason-nav { display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; }
.gpt-reason-nav button { display: flex; width: 40px; height: 40px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 999px; background: #ededed; color: #000; cursor: pointer; transition: background-color .15s, opacity .15s; } /* GitBook carousel arrows: flat grey circle, no border, 30% when at an end */
.gpt-reason-nav button:hover:not(:disabled) { background: #e2e2e2; }
.gpt-reason-nav button:disabled { opacity: .3; cursor: default; }
.gpt-reason-nav svg { width: 20px; height: 20px; }
.gpt-reason-icon { display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 8px; background: #fafaf9; box-shadow: 0 1px 2px rgba(0,0,0,.25); color: #1c1917; } /* GitBook tile: no border, one tight shadow */
.gpt-reason-icon svg { width: 24px; height: 24px; }
.gpt-reason h3 { margin-top: 24px; color: #171717; font-size: 18px; font-weight: 500; line-height: 1.35; }
.gpt-reason p { margin: 10px 0 28px; color: #68736d; font-size: 14px; line-height: 1.55; }
.gpt-reason-tag { align-self: flex-start; margin-top: auto; padding: 10px 14px; border-radius: 999px; background: rgba(0,0,0,.04); color: #1a1a1a; font-size: 14px; font-weight: 500; line-height: 1.2; }
@media (max-width: 760px) { .gpt-reasons { --gpt-gutter: 20px; gap: 10px; } .gpt-reason { flex-basis: min(320px, 84vw); padding: 24px; } }
.gpt-links { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 24px; margin-top: 56px; }
.gpt-link-cover { display: block; width: 100%; height: auto; aspect-ratio: 1600 / 1072; object-fit: cover; border-radius: 8px; background: #f3f6f4; }
.gpt-links a { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.gpt-links strong { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 17px; font-weight: 500; line-height: 1.5; }
.gpt-links small { display: -webkit-box; overflow: hidden; margin-top: -20px; color: #4f5a53; font-size: 14px; line-height: 1.45; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
.gpt-faq-wrap { padding: 0; background: #fff; }
.gpt-faq-wrap .faq-section { width: min(860px, calc(100% - 64px)); height: auto; border-radius: 0; background: transparent; } /* no radius: it clipped both ends of the last divider */
.gpt-faq-wrap .faq-card { width: 100%; min-height: 0; margin-top: 0; padding: 0; background: transparent; }
.gpt-faq-wrap .faq-answer p { max-width: 700px; }
@media (max-width: 760px) { .gpt-faq-wrap .faq-section { width: calc(100% - 40px); margin: 0 auto; padding-bottom: 0; } }
/* closing CTA: frosted-glass panel over a slow mesh gradient in the page's sky-blue + brand-green palette */
.gpt-close { padding: 112px 32px; background: #fff; }
.gpt-close-card { --close-blue: #8ec5ff; --close-green: #3fd17a; --close-deep-green: #128a4c; position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); min-height: 440px; padding: 16px; overflow: hidden; border-radius: 20px; background: linear-gradient(115deg, #f5f9fc 0%, #e8f2ff 48%, #d4e8ff 100%); }
.gpt-close-mesh { position: absolute; z-index: -2; inset: 0; overflow: hidden; pointer-events: none; }
.gpt-close-mesh span { position: absolute; border-radius: 50%; filter: blur(48px); will-change: transform; }
.gpt-close-mesh span:nth-child(1) { top: -18%; right: -6%; width: 58%; height: 78%; background: var(--close-blue); opacity: .9; animation: gpt-mesh-a 18s ease-in-out infinite alternate; }
.gpt-close-mesh span:nth-child(2) { bottom: -34%; right: 8%; width: 52%; height: 74%; background: var(--close-green); opacity: .7; animation: gpt-mesh-b 22s ease-in-out infinite alternate; }
.gpt-close-mesh span:nth-child(3) { top: 30%; right: 22%; width: 34%; height: 44%; background: #d8f6e6; opacity: .95; animation: gpt-mesh-c 26s ease-in-out infinite alternate; }
.gpt-close-mesh span:nth-child(4) { bottom: -18%; right: -10%; width: 32%; height: 46%; background: var(--close-deep-green); opacity: .55; animation: gpt-mesh-b 20s ease-in-out infinite alternate-reverse; }
.gpt-close-mesh span:nth-child(5) { top: -30%; left: 28%; width: 46%; height: 52%; background: #dff5b8; opacity: .55; animation: gpt-mesh-a 24s ease-in-out infinite alternate-reverse; }
.gpt-close-card::before { content: ''; position: absolute; z-index: -1; inset: 0; pointer-events: none; background: rgba(0,0,0,.02); } /* 2% black wash over the mesh */
.gpt-close-card::after { content: ''; position: absolute; z-index: -1; inset: 0; pointer-events: none; opacity: .18; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
@keyframes gpt-mesh-a { 0% { transform: translate3d(0, 0, 0) scale(1); } 100% { transform: translate3d(-8%, 10%, 0) scale(1.12); } }
@keyframes gpt-mesh-b { 0% { transform: translate3d(0, 0, 0) scale(1); } 100% { transform: translate3d(10%, -8%, 0) scale(1.08); } }
@keyframes gpt-mesh-c { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-14%, -10%, 0); } }
.gpt-close-glass { display: flex; flex-direction: column; align-items: flex-start; padding: 40px; border-radius: 14px; background: rgba(255,255,255,.5); -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); text-align: left; }
.gpt-close-eyebrow { color: #5f6663; font-size: 15px; font-weight: 500; }
.gpt-close .gpt-close-head { margin-bottom: 36px; }
.gpt-close .gpt-close-head h2 { max-width: none; margin-top: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 38px; font-weight: 600; line-height: 1.1; text-align: center; }
.gpt-close-quote { width: 36px; height: 29px; margin-top: 28px; color: #c8cdcb; }
.gpt-close-titles { margin-top: 14px; }
.gpt-close .gpt-close-glass h2 { max-width: 22em; text-wrap: pretty; margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; font-size: 32px; font-weight: 600; line-height: 1.2; }
.gpt-close-brand { display: inline-block; background: linear-gradient(120deg, var(--close-blue), var(--close-green) 55%, var(--close-deep-green)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.gpt-close-subs { margin: 12px 0 28px; }
.gpt-close-sub { max-width: 40em; color: #4f5653; font-size: 15px; line-height: 1.55; text-wrap: pretty; }
/* translucent pill CTA, like the reference card's "阅读更多" button */
.gpt-close a { display: inline-flex; align-self: flex-end; align-items: center; gap: 8px; margin-top: auto; padding: 10px 18px; font-size: 14px; border-radius: 999px; background: rgba(255,255,255,.2); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); color: #171717; font-weight: 500; transition: background .2s ease; }
.gpt-close a:hover { background: rgba(255,255,255,.4); }
.gpt-close-mark { position: relative; display: grid; place-items: center; padding-left: 6%; } /* nudged right of the column centre */
.gpt-close-logo { width: 76px; height: 76px; background: #fff; -webkit-mask: var(--logo) center / contain no-repeat; mask: var(--logo) center / contain no-repeat; }
/* rotor: every slide sits in the same grid cell so height never jumps; the active one fades/blurs in, the previous one exits upward */
.gpt-close-rotor { display: grid; }
.gpt-close-rotor > * { grid-area: 1 / 1; opacity: 0; transform: translateY(10px); filter: blur(6px); pointer-events: none; transition: opacity .6s ease, transform .6s ease, filter .6s ease; }
.gpt-close-rotor > .is-prev { transform: translateY(-10px); }
.gpt-close-rotor > .is-active { opacity: 1; transform: none; filter: blur(0); pointer-events: auto; }
.gpt-close-subs > * { transition-delay: .08s; }
.gpt-close-mark > * { transform: translateY(10px) scale(.92); }
.gpt-close-mark > .is-prev { transform: translateY(-10px) scale(.96); }
.gpt-close-mark > .is-active { transform: none; }
@media (max-width: 900px) { .gpt-close-card { grid-template-columns: 1fr; min-height: 0; } .gpt-close-glass { min-height: 360px; padding: 32px; } .gpt-close-mark { order: -1; height: 150px; padding-left: 0; } .gpt-close-mesh span:nth-child(1) { top: -20%; right: -20%; width: 90%; height: 50%; } .gpt-close-mesh span:nth-child(2) { bottom: -20%; right: -10%; width: 90%; height: 50%; } .gpt-close-mesh span:nth-child(3) { top: 8%; right: 30%; width: 50%; height: 30%; } }
@media (max-width: 760px) { .gpt-close-card { padding: 10px; border-radius: 16px; } .gpt-close-glass { min-height: 320px; padding: 24px 20px; } .gpt-close-quote { width: 28px; height: 22px; margin-top: 20px; } .gpt-close-titles { margin-top: 12px; } .gpt-close .gpt-close-glass h2 { font-size: 22px; } .gpt-close-subs { margin: 10px 0 24px; } .gpt-close-sub { font-size: 14px; } .gpt-close-mark { height: 120px; } .gpt-close-logo { width: 56px; height: 56px; } }
@media (prefers-reduced-motion: reduce) { .gpt-close-mesh span { animation: none; } .gpt-close-rotor > * { transition: none; } }
.gpt-page :deep(.site-footer) { margin-top: 0; padding-top: 72px; }
.gpt-page :deep(.footer-wordmark p) { background-image: linear-gradient(103.14deg, #f0b89c 0%, #fbe7dc 38%, #e08e6e 68%, #f0b89c 100%); }
@media (max-width: 900px) { h1 { font-size: min(34px, 4.3vw); } .gpt-section h2, .gpt-close h2, .gpt-close .gpt-close-head h2 { font-size: 30px; } }
@media (max-width: 760px) { h1 { font-size: 34px; } }
@media (max-width: 600px) { .gpt-intro { font-size: 13.5px; } .gpt-preview { --cgm-ratio: 1.2; } }
@media (max-width: 1000px) {
  .gpt-trust-layout { gap: 36px; }
  .gpt-system-layout { grid-template-columns: 1fr; gap: 24px; }
  .gpt-system-visual { justify-content: center; }
}
@media (max-width: 760px) {
  .gpt-trust-layout { grid-template-columns: 1fr; gap: 32px; }
  .gpt-trust-visual { width: 100%; }
  .gpt-system-layout { gap: 24px; }
}
@media (max-width: 760px) { .gpt-hero { padding: 104px 20px 0; } .gpt-section { padding: 72px 20px; } .gpt-grid, .gpt-links { grid-template-columns: 1fr; } .gpt-preview { margin-top: 60px; } .gpt-card { padding: 24px; } .gpt-close { padding: 72px 20px; } }
/* Claude palette for the shared visuals, scoped to this page so the components themselves stay untouched */
.gpt-page :deep(.landing-gradient) { background: linear-gradient(180deg, #fcf8f4 0%, #faf0e8 48%, #f6dccb 100%); }
.gpt-page :deep(.landing-gradient span:nth-child(1)) { background: #f0b89c; }
.gpt-page :deep(.landing-gradient span:nth-child(2)) { background: #d97757; }
.gpt-page :deep(.landing-gradient span:nth-child(3)) { background: #fbe7dc; }
.gpt-page :deep(.landing-gradient span:nth-child(4)) { background: #b5532f; }
.gpt-page :deep(.landing-gradient span:nth-child(5)) { background: #f6e1c8; }
.gpt-page :deep(.tcv) { background: linear-gradient(115deg, #fcf8f5 0%, #faeee6 48%, #f6dccb 100%); }
/* trust card frame follows the hero: #ebb58c on the left, #de926e on the right, kept light */
.gpt-page .gpt-trust-visual :deep(.tcv) { background: linear-gradient(180deg, #fefcfa 0%, #fdf8f4 50%, #fbf1eb 100%); }
.gpt-page .gpt-trust-visual :deep(.landing-gradient) { background: linear-gradient(180deg, #fefcfa 0%, #fdf8f4 48%, #f9ece4 100%); }
.gpt-page .gpt-trust-visual :deep(.landing-gradient span:nth-child(1)) { background: #f0ad80; opacity: .42; }
.gpt-page .gpt-trust-visual :deep(.landing-gradient span:nth-child(2)) { background: #ffdc4a; opacity: .55; bottom: -71%; }
.gpt-page .gpt-trust-visual :deep(.landing-gradient span:nth-child(3)) { background: #fdf3ec; opacity: .9; }
.gpt-page .gpt-trust-visual :deep(.landing-gradient span:nth-child(4)) { top: auto; right: -16%; bottom: -6%; left: auto; width: 42%; height: 62%; background: #f6c1b0; opacity: .5; } /* coral / peach pink beside the yellow, same tone as the closing card */
.gpt-page .gpt-trust-visual :deep(.landing-gradient span:nth-child(5)) { background: #f0ad80; opacity: .22; }
/* risk score frame: same orange + yellow background as the trust card */
.gpt-page .gpt-system-visual :deep(.landing-gradient) { background: linear-gradient(180deg, #fefcfa 0%, #fdf8f4 48%, #f9ece4 100%); }
.gpt-page .gpt-system-visual :deep(.landing-gradient span:nth-child(1)) { background: #f0ad80; opacity: .42; }
.gpt-page .gpt-system-visual :deep(.landing-gradient span:nth-child(2)) { background: #ffdc4a; opacity: .55; bottom: -71%; }
.gpt-page .gpt-system-visual :deep(.landing-gradient span:nth-child(3)) { background: #fdf3ec; opacity: .9; }
.gpt-page .gpt-system-visual :deep(.landing-gradient span:nth-child(4)) { top: auto; right: -16%; bottom: -6%; left: auto; width: 42%; height: 62%; background: #f6c1b0; opacity: .5; } /* coral / peach pink beside the yellow, same tone as the closing card */
.gpt-page .gpt-system-visual :deep(.landing-gradient span:nth-child(5)) { background: #f0ad80; opacity: .22; }
/* closing card: same orange + yellow mesh as the two visuals above (template: sky-blue + green) */
.gpt-page .gpt-close-card { --close-blue: #f4a978; --close-green: #ffdc4a; --close-deep-green: #ea8556; background: linear-gradient(115deg, #fefcfa 0%, #fcf3ec 48%, #f8e6d8 100%); }
.gpt-page .gpt-close-mesh span:nth-child(1) { opacity: .62; }
.gpt-page .gpt-close-mesh span:nth-child(2) { opacity: .48; }
.gpt-page .gpt-close-mesh span:nth-child(3) { background: #fdf3ec; }
.gpt-page .gpt-close-mesh span:nth-child(4) { opacity: .36; }
.gpt-page .gpt-close-mesh span:nth-child(5) { background: #f6c1b0; opacity: .42; } /* a touch of coral / peach pink */
.gpt-page .gpt-close-brand { background-image: linear-gradient(120deg, #e8a072, #d97757 55%, #b5532f); }
.gpt-page :deep(.rsv-dot) { background: #d97757; }
/* score ring: the 42 lit ticks run light peach -> deep terracotta (template: blue -> green) */
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+1):nth-child(-n+6)) { stroke: #eeac8f; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+7):nth-child(-n+12)) { stroke: #e99c7c; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+13):nth-child(-n+18)) { stroke: #e48d6b; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+19):nth-child(-n+24)) { stroke: #de805e; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+25):nth-child(-n+30)) { stroke: #d97757; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+31):nth-child(-n+36)) { stroke: #c9643f; }
.gpt-page :deep(.rsv.is-shown .rsv-ring line:nth-child(n+37):nth-child(-n+42)) { stroke: #b5532f; }
/* risk score visual on the right of the four layer cards (desktop only; stacked layout keeps it on top) */
@media (min-width: 1001px) { .gpt-system-layout { grid-template-columns: minmax(0, 1.3fr) minmax(0, .7fr); } .gpt-system-visual { order: 2; } }
/* trust card on the left, copy on the right (two-column layout only; stacked layout keeps copy first) */
@media (min-width: 761px) { .gpt-trust-visual { order: -1; } }
</style>
