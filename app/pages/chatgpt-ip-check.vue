<script setup lang="ts">
const { locale } = useI18n()
const CHATGPT_LOGO_PATH = 'M21.5502 10.0045C21.7999 9.2642 21.8865 8.47863 21.804 7.70172C21.7215 6.9248 21.4719 6.17494 21.0722 5.50358C19.8553 3.41361 17.4103 2.33763 15.0223 2.84362C14.4934 2.25803 13.8465 1.79105 13.1242 1.4734C12.4019 1.15576 11.6205 0.994639 10.8314 1.00065C8.39044 0.995651 6.22448 2.54663 5.47349 4.83859C4.70155 4.99312 3.9713 5.31002 3.33117 5.76826C2.69103 6.22651 2.15566 6.81563 1.76055 7.49655C1.16333 8.5108 0.908096 9.69021 1.03252 10.8606C1.15694 12.031 1.65444 13.1304 2.45154 13.9965C2.20155 14.7368 2.11474 15.5225 2.19708 16.2996C2.27942 17.0767 2.52894 17.8268 2.92853 18.4984C4.14551 20.5884 6.59047 21.6633 8.97843 21.1583C9.50716 21.7438 10.1539 22.2107 10.8761 22.5282C11.5983 22.8456 12.3795 23.0066 13.1684 23.0003C15.6113 23.0063 17.7783 21.4543 18.5293 19.1604C19.3018 19.0059 20.0325 18.6888 20.673 18.2302C21.3135 17.7716 21.8491 17.1819 22.2442 16.5004C22.8403 15.4862 23.0947 14.3073 22.9699 13.1376C22.8452 11.9678 22.3478 10.8691 21.5512 10.0035L21.5502 10.0045ZM13.1694 21.5623C12.194 21.5647 11.2482 21.2274 10.4944 20.6084C10.5284 20.5903 10.5874 20.5584 10.6264 20.5344L15.0663 18.0044C15.1771 17.9426 15.2694 17.8521 15.3334 17.7426C15.3974 17.633 15.4309 17.5083 15.4303 17.3814V11.2055L17.3073 12.2745C17.3273 12.2845 17.3403 12.3035 17.3433 12.3245V17.4394C17.3403 19.7134 15.4733 21.5573 13.1694 21.5623ZM4.19251 17.7804C3.70314 16.948 3.52658 15.9683 3.69452 15.0174C3.72652 15.0374 3.78451 15.0724 3.82551 15.0954L8.26545 17.6254C8.49044 17.7554 8.76944 17.7554 8.99543 17.6254L14.4154 14.5374V16.6754C14.4158 16.6864 14.4136 16.6973 14.4089 16.7072C14.4042 16.7172 14.3971 16.7258 14.3884 16.7324L9.90042 19.2884C7.90145 20.4244 5.34849 19.7484 4.19351 17.7784L4.19251 17.7804ZM3.02353 8.21654C3.51481 7.37855 4.28448 6.73946 5.19849 6.41057L5.19649 6.56156V11.6215C5.19588 11.7485 5.22932 11.8734 5.29334 11.9832C5.35735 12.0929 5.4496 12.1835 5.56049 12.2455L10.9804 15.3324L9.10443 16.4024C9.09515 16.4084 9.08455 16.4119 9.07356 16.4128C9.06257 16.4137 9.05154 16.4118 9.04143 16.4074L4.5525 13.8485C2.55753 12.7085 1.87354 10.1905 3.02253 8.21854L3.02353 8.21654ZM18.4403 11.7565L13.0204 8.66853L14.8963 7.60055C14.9055 7.59444 14.9161 7.59069 14.9271 7.58964C14.9381 7.5886 14.9492 7.59028 14.9593 7.59455L19.4483 10.1515C21.4462 11.2915 22.1312 13.8135 20.9772 15.7844C20.4855 16.6219 19.7165 17.2611 18.8033 17.5914V12.3805C18.8039 12.2537 18.7706 12.129 18.7068 12.0195C18.6429 11.9099 18.5509 11.8195 18.4403 11.7575V11.7565ZM20.3073 8.98353C20.2636 8.95697 20.2196 8.93097 20.1753 8.90553L15.7353 6.37557C15.6244 6.31178 15.4988 6.27821 15.3708 6.27821C15.2429 6.27821 15.1172 6.31178 15.0063 6.37557L9.58643 9.46352V7.32555C9.58599 7.31458 9.58822 7.30366 9.59292 7.29373C9.59762 7.28381 9.60466 7.27517 9.61343 7.26855L14.1004 4.71359C16.1003 3.57661 18.6553 4.2536 19.8073 6.22657C20.2943 7.05956 20.4723 8.03554 20.3073 8.98353ZM8.56644 12.7935L6.68947 11.7255C6.67967 11.7207 6.67124 11.7135 6.66495 11.7046C6.65866 11.6957 6.65471 11.6853 6.65347 11.6745V6.55957C6.65447 4.2826 8.52644 2.43763 10.8344 2.43963C11.8104 2.43963 12.7544 2.77762 13.5054 3.39361C13.4714 3.41161 13.4134 3.44361 13.3744 3.46661L8.93444 5.99657C8.82344 6.05828 8.73103 6.14863 8.66683 6.25821C8.60263 6.36778 8.569 6.49257 8.56944 6.61956L8.56644 12.7925V12.7935ZM9.58643 10.6255L12.0004 9.25052L14.4144 10.6255V13.3755L12.0004 14.7504L9.58543 13.3755V10.6255H9.58643Z'
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
    title: "ChatGPT IP Blocked / Unusual Activity? Free IP Check — IP Ready",
    description: `ChatGPT blocking your IP, flagging "unusual activity," or looping on verification? Check the 12 network signals behind your connection — proxy/VPN detection, blacklist status, ASN reputation — and get a plain verdict for ChatGPT before you sign in. Free, no signup.`,
    h1: 'ChatGPT IP Blocked? Unusual Activity? Check Your IP First.',
    sub: `ChatGPT scores your connection before you type a word. Check the same signals first and get a clear verdict before you sign in.`,
    after: `That's your connection as platforms see it. The rest of this page explains what moves the verdict.`,
    viewpoint: `Getting Connected Isn't the Same as Being Trusted`,
    viewpointBody: `A working VPN proves little. ChatGPT cares what your IP is: home or datacenter, yours alone or shared, clean or flagged. Connection is a network question; trust is a reputation question. This page checks trust.`,
    system: 'One Check, Run the Way Platforms Run It', intro: `Four layers, one verdict — here's what the checker reads in your connection.`,
    layers: [
      ['12 Risk Signals, Not One Guess', `ISP and ASN, network type, DNS and geolocation — the basic identity of your connection, assembled the way a platform's risk stack sees it.`],
      ['Proxy, VPN and Tor Detection', 'Known VPN and proxy exits are flagged on sight — and a datacenter IP that behaves like an exit is marked as a suspected exit even when it appears on no list.'],
      ['Blacklists and Abuse History', "Your address is checked against blacklist and abuse feeds. IPs are recycled; a previous user's history can follow the address long after they've moved on."],
      ['A Verdict for ChatGPT, Not Just a Number', 'Every check ends in a per-platform readiness verdict with the reasons behind it — so you know whether ChatGPT is likely to let you in, challenge you, or turn you away, and why.'],
    ],
    why: 'Why ChatGPT Flags an IP', whySub: `Most blocks are decided before you type a word. These are the five network signals ChatGPT's risk systems weigh first.`, reasons: [
      ['Datacenter & Hosting IPs', 'ChatGPT sits behind heavy bot mitigation. IPs from cloud and hosting ranges are treated as automated traffic by default — even when a real person is behind them.'],
      ['Shared VPN & Proxy Exits', "A popular exit serves thousands of users at once. If a few of them tripped abuse systems, the exit's reputation drops for everyone on it. You inherit strangers' history."],
      ['Blacklist & Abuse History', 'The IP your ISP or VPN assigns today may carry reports from a previous user. That history is visible to risk systems before your first prompt.'],
      ['Region & Timezone Mismatch', `Account country, IP geolocation and device timezone telling three different stories is a classic anomaly signal — it surfaces as "not available in your country" errors or mid-session challenges.`],
      ['IP Changes Mid-Session', 'Switching VPN servers or networks while signed in can invalidate the session and force re-verification. Rapid IP hopping looks like session hijacking to automated defenses.'],
    ],
    reasonTags: ['Network Type', 'Shared Exits', 'Blacklists', 'Geolocation', 'Session'],
    stats: [{ value: 12, label: 'Risk signals analyzed' }, { value: 'Live', label: 'Real-time results' }, { value: 5, label: 'Platforms evaluated' }, { value: 1, label: 'Clear verdict' }],
    links: [
      ['Why ChatGPT and Claude Block Your IP', '/blog/why-chatgpt-claude-blocking-your-ip', 'Datacenter ranges, shared exits, location: the signals AI platforms weigh when scoring your connection.'],
      ['What Is an IP Risk Score?', '/blog/what-is-ip-risk-score', 'What goes into a risk score, what the numbers mean, and how it decides whether a platform lets you in.'],
      ['Why Is My IP Blacklisted?', '/blog/why-is-my-ip-blacklisted', 'Why IPs land on blocklists, how to see which lists carry your address, and how to request removal.'],
    ],
    faqHeading: 'FAQ', faq: [
      [`Why does ChatGPT say "unusual activity" and keep asking me to verify?`, 'That message usually means the risk systems scored your connection, not your account. Datacenter IPs, shared VPN exits, and addresses with abuse history are the most common triggers. Run the free check above to see which of those signals your current IP carries.'],
      ['Can a VPN cause ChatGPT to block me?', "Yes. A VPN doesn't hide your network type — it replaces it with the VPN's. If the exit is a flagged datacenter range or is shared with flagged users, ChatGPT may challenge it more aggressively than your home connection."],
      ["ChatGPT says it's not available in my country, but I'm in a supported region. Why?", "Usually a geolocation mismatch: your exit IP resolves to a different country than the one you're actually in — common with VPNs and some mobile carriers. Check the location your IP reports above, and use an exit that resolves to your real region."],
      ['What Safety Score is safe for ChatGPT?', "There's no official cutoff — OpenAI doesn't publish one. As a working guide, a high Safety Score with no proxy/VPN detection and no blacklist hits behaves like an ordinary home connection. Challenges typically start as the score drops, especially when the network type reads datacenter or hosting."],
    ], closeTitle: 'Check Before You Sign In', closeEyebrow: 'Free for ChatGPT, Claude, Amazon, eBay & Binance', closeSlides: [
      { logo: 'chatgpt', title: "Don't Guess Which Side of ChatGPT's Risk Line You're On.", sub: 'Twelve network signals, one plain verdict. Know whether ChatGPT will let you in before you sign in. Free, no signup.' },
      { logo: 'claude', title: 'Know If Claude Will Trust Your Connection.', sub: "Datacenter ranges and shared VPN exits are the first things Claude's checks catch. See what your IP carries before you start a session." },
      { logo: 'amazon', title: 'Make Sure Amazon Sees a Clean, Trusted IP.', sub: 'Flagged or shared IPs can trigger extra verification on Amazon. Check your network type and reputation before you log in.' },
      { logo: 'ebay', title: 'Sign In to eBay Without the Extra Checks.', sub: 'Proxy exits and blacklisted addresses are common triggers for eBay security holds. See where your IP stands first.' },
      { logo: 'binance', title: 'Check Your IP Before Binance Does at Login.', sub: 'Exchanges check location, VPN use and IP reputation at login. See what Binance sees in your connection, in seconds.' },
    ], cta: 'Check My IP',
  },
  zh: {
    title: 'ChatGPT IP 被封？免费检测你的 IP 安全评分 — IP Ready',
    description: 'ChatGPT 提示异常活动、反复人机验证，或者直接拦下你的 IP？免费检测你连接背后的 12 个网络信号——代理/VPN 识别、黑名单状态、ASN 信誉——登录之前，先拿到针对 ChatGPT 的明确结论。完全免费，无需注册。',
    h1: 'ChatGPT IP 被封？提示异常活动？先查你的 IP。',
    sub: 'ChatGPT 在你输入第一个字之前，就已经给你的连接打过分了。登录之前，先查一遍同样的信号，拿到明确结论。',
    after: '这就是平台眼中你的连接。下面把结论背后的原因讲清楚。', viewpoint: '连得上，不等于被信任',
    viewpointBody: 'VPN 连得上，证明不了什么。ChatGPT 看的是你的 IP：家庭还是机房，独享还是共用，干净还是有前科。连通是网络问题，信任是信誉问题，这一页查的是信任。',
    system: '一次检测，按平台看 IP 的方式来查', intro: '四层信号，一个结论——检测器读的是你连接里的这些东西。', layers: [
      ['12 项风险信号，不靠猜', 'ISP 与 ASN、网络类型、DNS 与地理位置——你这条连接的基本身份，按平台风控拼凑它的同款方式组装出来。'],
      ['代理 / VPN / Tor 识别', '已知的 VPN 与代理出口会被直接标记；而一个行为像出口的机房 IP，即使不在任何名单上，也会被标为「疑似出口」。'],
      ['黑名单与滥用历史', '你的地址会被拿去比对黑名单与滥用数据库。IP 是循环使用的，上一个用户的历史，可能在这个地址上留很久。'],
      ['给 ChatGPT 的结论，不只是一个数字', '每次检测最后都落到逐平台的就绪度结论，并附上理由——ChatGPT 大概率会放行、会验证、还是会拦下，以及为什么。'],
    ], why: '为什么 ChatGPT 会拦一个 IP', whySub: '大多数拦截，在你输入第一个字之前就已经决定了。下面是 ChatGPT 风控最先看的五类网络信号。', reasons: [
      ['机房和托管 IP 段', 'ChatGPT 前面挡着很重的机器人防护层。云服务器和托管机房段的 IP 默认被当成自动化流量——哪怕背后坐的是真人。'],
      ['多人共用的 VPN / 代理出口', '热门出口同时被成千上万个用户使用。只要其中一小部分触发过滥用系统，这个出口的信誉就被所有人一起拖下水。你在替陌生人的历史买单。'],
      ['IP 黑名单与滥用历史', '你今天被 ISP 或 VPN 分到的地址，可能带着上一个用户的滥用记录。这段历史在你输入第一条 prompt 之前，风控就已经看到了。'],
      ['地区与时区对不上', '账号常用国家、IP 地理位置、设备时区三者讲三个故事，是最经典的异常信号。表现出来就是「在你所在的国家不可用」这类报错，或者会话中途突然弹出验证。'],
      ['会话中途频繁换 IP', '登录状态下切换 VPN 节点或网络，可能让会话失效并强制重新验证。IP 短时间内跳来跳去，在自动防护眼里很像会话劫持。'],
    ], reasonTags: ['网络类型', '共享出口', '黑名单', '地理位置', '会话'], stats: [{ value: 12, label: '风险信号' }, { value: '实时', label: '检测结果' }, { value: 5, label: '评估平台' }, { value: 1, label: '明确结论' }], links: [
      ['为什么 ChatGPT 和 Claude 会封你的 IP', '/blog/why-chatgpt-claude-blocking-your-ip', '从机房 IP、共享出口到地理位置，拆解 AI 平台风控给你的连接打分时看的几项信号。'],
      ['IP 风险分是什么', '/blog/what-is-ip-risk-score', '风险分由哪些信号组成、分数高低意味着什么，以及它和平台最终放不放行之间的关系。'],
      ['为什么我的 IP 进了黑名单', '/blog/why-is-my-ip-blacklisted', 'IP 被列入黑名单的常见原因，如何查你的地址在哪些名单上，以及怎么申请移除。'],
    ], faqHeading: '常见问题', faq: [
      ['为什么 ChatGPT 老是提示「异常活动」，还要我反复验证？', '这类提示通常说明风控在给你的连接打分，而不是你的账号有问题。机房 IP、共用 VPN 出口、带滥用历史的地址是最常见的三个触发点。跑一遍上面的免费检测，就能看到你当前的 IP 中了哪几条。'],
      ['用 VPN 会导致 ChatGPT 封我吗？', '会。VPN 并不会隐藏你的网络类型，只是把它换成了 VPN 出口的类型。如果出口是被标记过的机房段，或者和被标记的用户共用，ChatGPT 对它的验证反而可能比你的家庭宽带更严。'],
      ['我明明在支持的地区，为什么提示 ChatGPT 不可用？', '多半是地理位置对不上：你的出口 IP 被解析到了另一个国家（VPN 和部分移动网络很常见）。先看上面检测出的 IP 所在地，再换一个解析到你真实地区的出口。'],
      ['安全评分要多少，对 ChatGPT 才算安全？', '没有官方分数线——OpenAI 没有公布过。经验上：安全评分高、没有代理/VPN 检出、没有黑名单记录的 IP，表现和普通家庭连接无异；分数往下掉、再加上网络类型显示为机房或托管，验证通常就是从这里开始找上门的。'],
    ], closeTitle: '登录之前，先查一遍', closeEyebrow: '免费检测 ChatGPT、Claude、Amazon、eBay、Binance', closeSlides: [
      { logo: 'chatgpt', title: '别再靠猜了：你的 IP 到底落在 ChatGPT 风控线的哪一边？', sub: '12 项网络信号，一个明确结论。登录之前，就知道 ChatGPT 会不会放行你。免费，无需注册。' },
      { logo: 'claude', title: '登录之前，先确认 Claude 会不会信任你的连接。', sub: '机房 IP 段和共用 VPN 出口，是 Claude 风控最先拦下的两类连接。开始对话之前，先看看你的 IP 带着什么记录。' },
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
  path: '/chatgpt-ip-check',
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
    key: 'chatgpt-faq-jsonld',
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
        <h1><span class="gpt-h1-badge" aria-hidden="true" @click="spinBadge"><svg class="gpt-h1-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" :d="CHATGPT_LOGO_PATH" fill="currentColor" /></svg></span>{{ h1Parts[0] }}<template v-if="h1Parts[1]"><br class="gpt-h1-br" />{{ (locale === 'zh' ? '' : ' ') + h1Parts[1] }}</template></h1>
        <p class="gpt-intro">{{ copy.sub }}</p>
        <div class="gpt-preview"><ChatGptMock :lang="locale === 'zh' ? 'zh' : 'en'" :logo-path="CHATGPT_LOGO_PATH" /></div>
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
.gpt-hero-base { position: absolute; z-index: -3; top: -64px; bottom: 0; left: 50%; width: 100vw; margin-left: -50vw; pointer-events: none; background: linear-gradient(110deg, #f4faf7, #f2f7fd); }
.gpt-hero::before, .gpt-hero-flow { position: absolute; z-index: -1; top: -64px; bottom: 0; left: 50%; width: 100vw; margin-left: -50vw; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 20%, rgba(0,0,0,.22) 38%, transparent 52%); mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 20%, rgba(0,0,0,.22) 38%, transparent 52%); }
.gpt-hero::before, .gpt-hero::after { content: ''; }
.gpt-hero::before, .gpt-hero::after { z-index: -2; } /* sky-blue / aqua / mint base under the moving white light */
.gpt-hero::after { position: absolute; z-index: -2; top: -64px; bottom: 0; left: 50%; width: 120vw; margin-left: -60vw; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 20%, rgba(0,0,0,.22) 38%, transparent 52%); mask-image: linear-gradient(180deg, #000 0%, rgba(0,0,0,.75) 20%, rgba(0,0,0,.22) 38%, transparent 52%); background: radial-gradient(40% 60% at 78% 0%, rgba(96,165,250,.38), rgba(96,165,250,0) 72%), radial-gradient(36% 58% at 20% 8%, rgba(110,208,146,.26), rgba(110,208,146,0) 72%), radial-gradient(30% 45% at 48% 2%, rgba(206,236,176,.28), rgba(206,236,176,0) 70%), radial-gradient(34% 50% at 60% 30%, rgba(150,214,222,.2), rgba(150,214,222,0) 70%); animation: gpt-hero-drift 16s ease-in-out infinite alternate; }
@keyframes gpt-hero-drift { 0% { transform: translate3d(-5%, 0, 0); } 100% { transform: translate3d(5%, 0, 0); } }
.gpt-hero-flow { z-index: -1; }
.gpt-hero::before { background: linear-gradient(100deg, rgb(228,247,235) 0%, rgb(232,247,244) 35%, rgb(224,237,255) 70%, rgb(210,230,255) 100%); animation: gpt-hero-breathe 9s ease-in-out infinite; }
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
.gpt-num { color: #4c9b70; font-size: 12px; font-weight: 700; }
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
.gpt-page :deep(.footer-wordmark p) { background-image: linear-gradient(103.14deg, #8ec5ff 0%, #d8f6e6 38%, #7cdaa3 68%, #8ec5ff 100%); }
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
</style>
