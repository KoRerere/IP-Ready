<script setup lang="ts">
const { locale } = useI18n()
const openFaq = ref<number | null>(0)
const content = {
  en: {
    title: "ChatGPT IP Blocked / Unusual Activity? Free IP Check — IP Ready",
    description: `ChatGPT blocking your IP, flagging "unusual activity," or looping on verification? Check the 12 network signals behind your connection — proxy/VPN detection, blacklist status, ASN reputation — and get a plain verdict for ChatGPT before you sign in. Free, no signup.`,
    eyebrow: ['Free · No sign-up required', '12 risk signals checked', 'Verdicts for 5 platforms'],
    h1: 'ChatGPT IP Blocked or Unusual Activity? Check Your IP First.',
    sub: `When ChatGPT flags "unusual activity" or traps you in verification loops, its risk systems have usually scored your connection before you've typed a word. Run the same signals they see — and get a clear verdict for ChatGPT before you sign in.`,
    after: `That's your connection as platforms see it. The rest of this page explains what moves the verdict.`,
    viewpoint: `Getting Connected Isn't the Same as Being Trusted`,
    viewpointBody: `A VPN that connects proves almost nothing. ChatGPT doesn't ask whether your traffic arrives — it asks what your IP is: a home connection or a datacenter range, exclusively yours or shared with thousands of strangers, clean or carrying someone else's abuse history. Connection is a network question. Trust is a reputation question. This page checks the second one.`,
    system: 'One Check, Run the Way Platforms Run It', intro: `Four layers, one verdict — here's what the checker reads in your connection.`,
    layers: [
      ['12 risk signals, not one guess', `ISP and ASN, network type, DNS and geolocation — the basic identity of your connection, assembled the way a platform's risk stack sees it.`],
      ['Proxy, VPN and Tor detection', 'Known VPN and proxy exits are flagged on sight — and a datacenter IP that behaves like an exit is marked as a suspected exit even when it appears on no list.'],
      ['Blacklists and abuse history', "Your address is checked against blacklist and abuse feeds. IPs are recycled; a previous user's history can follow the address long after they've moved on."],
      ['A verdict for ChatGPT, not just a number', 'Every check ends in a per-platform readiness verdict with the reasons behind it — so you know whether ChatGPT is likely to let you in, challenge you, or turn you away, and why.'],
    ],
    why: 'Why ChatGPT Flags an IP', reasons: [
      ['Datacenter and hosting ranges', 'ChatGPT sits behind heavy bot mitigation. IPs from cloud and hosting ranges are treated as automated traffic by default — even when a real person is behind them.'],
      ['VPN and proxy exits shared by thousands', "A popular exit serves thousands of users at once. If a few of them tripped abuse systems, the exit's reputation drops for everyone on it. You inherit strangers' history."],
      ['Blacklist and abuse history on the address', 'The IP your ISP or VPN assigns today may carry reports from a previous user. That history is visible to risk systems before your first prompt.'],
      ['Region and timezone mismatch', `Account country, IP geolocation and device timezone telling three different stories is a classic anomaly signal — it surfaces as "not available in your country" errors or mid-session challenges.`],
      ['Sudden IP changes mid-session', 'Switching VPN servers or networks while signed in can invalidate the session and force re-verification. Rapid IP hopping looks like session hijacking to automated defenses.'],
    ],
    stats: ['12 risk signals', 'Real-time results', '5 platforms', '1 clear verdict'],
    links: [
      ['Why ChatGPT and Claude block your IP', '/blog/why-chatgpt-claude-blocking-your-ip', 'how platform risk systems weigh your connection'],
      ['What is an IP risk score?', '/blog/what-is-ip-risk-score', 'how the score behind the verdict works'],
      ['Why is my IP blacklisted?', '/blog/why-is-my-ip-blacklisted', 'check whether your address carries a listing'],
    ],
    faqHeading: 'FAQ', faq: [
      [`Why does ChatGPT say "unusual activity" and keep asking me to verify?`, 'That message usually means the risk systems scored your connection, not your account. Datacenter IPs, shared VPN exits, and addresses with abuse history are the most common triggers. Run the free check above to see which of those signals your current IP carries.'],
      ['Can a VPN cause ChatGPT to block me?', "Yes. A VPN doesn't hide your network type — it replaces it with the VPN's. If the exit is a flagged datacenter range or is shared with flagged users, ChatGPT may challenge it more aggressively than your home connection."],
      ["ChatGPT says it's not available in my country, but I'm in a supported region. Why?", "Usually a geolocation mismatch: your exit IP resolves to a different country than the one you're actually in — common with VPNs and some mobile carriers. Check the location your IP reports above, and use an exit that resolves to your real region."],
      ['What Safety Score is safe for ChatGPT?', "There's no official cutoff — OpenAI doesn't publish one. As a working guide, a high Safety Score with no proxy/VPN detection and no blacklist hits behaves like an ordinary home connection. Challenges typically start as the score drops, especially when the network type reads datacenter or hosting."],
    ], closing: "Don't guess which side of the line your IP is on.", cta: 'Check my IP',
  },
  zh: {
    title: 'ChatGPT IP 被封？免费检测你的 IP 安全评分 — IP Ready',
    description: 'ChatGPT 提示异常活动、反复人机验证，或者直接拦下你的 IP？免费检测你连接背后的 12 个网络信号——代理/VPN 识别、黑名单状态、ASN 信誉——登录之前，先拿到针对 ChatGPT 的明确结论。完全免费，无需注册。',
    eyebrow: ['完全免费 · 无需注册', '12 项风险信号检测', '五大平台逐项结论'], h1: 'ChatGPT IP 被封或提示异常活动？先查你的 IP。',
    sub: '当 ChatGPT 提示「异常活动」、让你反复验证时，它的风控系统通常在你输入第一个字之前，就已经给你的连接打过分了。把平台能看到的信号先查一遍——登录之前，先拿到针对 ChatGPT 的明确结论。',
    after: '这就是平台眼中你的连接。下面把结论背后的原因讲清楚。', viewpoint: '连得上，不等于被信任',
    viewpointBody: 'VPN 连通，几乎什么都证明不了。ChatGPT 在意的不是你的流量能不能到达，而是你的 IP 是什么：家庭连接还是机房段，只属于你还是和成千上万陌生人共用，干净还是背着别人的滥用历史。连通是网络问题，信任是信誉问题。这一页查的是后一个。',
    system: '次检测，按平台看 IP 的方式来查', intro: '四层信号，一个结论—检测器读的是你连接里的这些东西。', layers: [
      ['12 项风险信号，不靠猜', 'ISP 与 ASN、网络类型、DNS 与地理位置——你这条连接的基本身份，按平台风控拼凑它的同款方式组装出来。'],
      ['代 / VPN / Tor 识别', '已知的 VPN 与代理出口会被直接标记；而一个行为像出口的机房 IP，即使不在任何名单上，也会被标为「疑似出口」。'],
      ['黑名单与滥用历史', '你的地址会被拿去比对黑名单与滥用数据库。IP 是循环使用的，上一个用户的历史，可能在这个地址上留很久。'],
      ['给 ChatGPT的结论，不只是一个数字', '每次检测最后都落到逐平台的就绪度结论，并附上理由——ChatGPT 大概率会放行、会验证、还是会拦下，以及为什么。'],
    ], why: '为什么 ChatGPT 会拦一个 IP', reasons: [
      ['机房和托管IP 段', 'ChatGPT 前面挡着很重的机器人防护层。云服务器和托管机房段的 IP 默认被当成自动化流量——哪怕背后坐的是真人。'],
      ['成千上万人共用的 VPN / 代理出口', '热门出口同时被成千上万个用户使用。只要其中一小部分触发过滥用系统，这个出口的信誉就被所有人一起拖下水。你在替陌生人的历史买单。'],
      ['这个IP 的黑名单与滥用历史', '你今天被 ISP 或 VPN 分到的地址，可能带着上一个用户的滥用记录。这段历史在你输入第一条 prompt 之前，风控就已经看到了。'],
      ['地区与时区对不上', '账号常用国家、IP 地理位置、设备时区三者讲三个故事，是最经典的异常信号。表现出来就是「在你所在的国家不可用」这类报错，或者会话中途突然弹出验证。'],
      ['会中途频繁换 IP', '登录状态下切换 VPN 节点或网络，可能让会话失效并强制重新验证。IP 短时间内跳来跳去，在自动防护眼里很像会话劫持。'],
    ], stats: ['12 项风险信号', '实时出结果', '5 大平台', '1 个明确结论'], links: [
      ['为什么 ChatGPT 和 Claude 会封你的 IP', '/blog/why-chatgpt-claude-blocking-your-ip', '平台风控如何权衡你的连接'],
      ['IP 风险分是什么', '/blog/what-is-ip-risk-score', '结论背后的分数是怎么来的'],
      ['为什么我的 IP 进了黑名单', '/blog/why-is-my-ip-blacklisted', '查你的地址是否带着记录'],
    ], faqHeading: '常见问题', faq: [
      ['为什么 ChatGPT 老是提示「异常活动」，还要我反复验证？', '这类提示通常说明风控在给你的连接打分，而不是你的账号有问题。机房 IP、共用 VPN 出口、带滥用历史的地址是最常见的三个触发点。跑一遍上面的免费检测，就能看到你当前的 IP 中了哪几条。'],
      ['用 VPN 会导致 ChatGPT 封我吗？', '会。VPN 并不会隐藏你的网络类型，只是把它换成了 VPN 出口的类型。如果出口是被标记过的机房段，或者和被标记的用户共用，ChatGPT 对它的验证反而可能比你的家庭宽带更严。'],
      ['我明明在支持的地区为什么提示 ChatGPT 不可用？', '多半是地理位置对不上：你的出口 IP 被解析到了另一个国家（VPN 和部分移动网络很常见）。先看上面检测出的 IP 所在地，再换一个解析到你真实地区的出口。'],
      ['安全评分要多少，对 ChatGPT 才算安全？', '没有官方分数线——OpenAI 没有公布过。经验上：安全评分高、没有代理/VPN 检出、没有黑名单记录的 IP，表现和普通家庭连接无异；分数往下掉、再加上网络类型显示为机房或托管，验证通常就是从这里开始找上门的。'],
    ], closing: '别猜你的 IP 在线哪一边。', cta: '检测我的 IP',
  },
}
const copy = computed(() => content[locale.value === 'zh' ? 'zh' : 'en'])
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
        <div class="gpt-eyebrow"><span v-for="item in copy.eyebrow" :key="item">{{ item }}</span></div>
        <h1>{{ copy.h1 }}</h1>
        <p class="gpt-intro">{{ copy.sub }}</p>
        <figure class="gpt-preview"><img src="/assets/landing/chatgpt-home.png" alt="ChatGPT" width="1440" height="900" /></figure>
      </section>
      <section class="gpt-viewpoint gpt-section">
        <div class="gpt-container gpt-trust-layout">
          <div class="gpt-trust-copy"><h2>{{ copy.viewpoint }}</h2><p>{{ copy.viewpointBody }}</p></div>
          <figure class="gpt-trust-visual"><img src="/assets/landing/landing-illo-trust.webp?v=5-frosted" alt="" width="1254" height="1254" loading="lazy" decoding="async" /></figure>
        </div>
      </section>
      <section class="gpt-section gpt-system">
        <div class="gpt-container">
          <div class="gpt-heading"><h2>{{ copy.system }}</h2><p>{{ copy.intro }}</p></div>
          <div class="gpt-system-layout">
            <figure class="gpt-system-visual"><img src="/assets/landing/landing-illo-system.webp?v=5-frosted" alt="" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
            <div class="gpt-grid"><article v-for="(item, i) in copy.layers" :key="item[0]" class="gpt-card"><span class="gpt-num">{{ String(i + 1).padStart(2, '0') }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div>
          </div>
        </div>
      </section>
      <section class="gpt-section gpt-why"><div class="gpt-container"><div class="gpt-heading"><h2>{{ copy.why }}</h2></div><div class="gpt-reasons"><article v-for="(item, i) in copy.reasons" :key="item[0]" class="gpt-reason"><span class="gpt-num">{{ String(i + 1).padStart(2, '0') }}</span><div><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></div></article></div></div></section>
      <section class="gpt-section"><div class="gpt-container"><div class="gpt-stats"><span v-for="item in copy.stats" :key="item">{{ item }}</span></div><div class="gpt-links"><a v-for="item in copy.links" :key="item[1]" :href="item[1]"><strong>{{ item[0] }} <span aria-hidden="true">↗</span></strong><small>{{ item[2] }}</small></a></div></div></section>
      <section class="gpt-section gpt-faq"><div class="gpt-narrow"><h2>{{ copy.faqHeading }}</h2><div class="gpt-faq-list"><article v-for="(item, i) in copy.faq" :key="item[0]" class="gpt-faq-item"><button type="button" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? null : i"><span>{{ item[0] }}</span><span aria-hidden="true">{{ openFaq === i ? '−' : '+' }}</span></button><p v-if="openFaq === i">{{ item[1] }}</p></article></div></div></section>
      <section class="gpt-close"><div class="gpt-container"><h2>{{ copy.closing }}</h2><a href="/check">{{ copy.cta }} <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.gpt-page { background: #fff; color: #202527; }
.gpt-hero { max-width: 1200px; margin: 0 auto; padding: 100px 32px 96px; text-align: center; }
.gpt-eyebrow { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.gpt-eyebrow span { padding: 8px 13px; border: 1px solid #e3e8e6; border-radius: 99px; background: #f9fbfa; color: #5a6d64; font-size: 12px; font-weight: 600; }
h1, h2, h3, p { margin: 0; }
h1 { max-width: 900px; margin: 28px auto 0; color: #0a0a0a; font-family: Geist, Inter, sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 600; line-height: 1.08; letter-spacing: 0; }
.gpt-intro { max-width: 780px; margin: 24px auto 0; color: #5b6661; font-size: 17px; line-height: 1.7; }
.gpt-preview { max-width: 1020px; margin: 52px auto 0; overflow: hidden; border: 1px solid #e3e8e6; border-radius: 14px; box-shadow: 0 24px 60px rgba(32,55,42,.1); }
.gpt-preview img { display: block; width: 100%; height: auto; }
.gpt-section { padding: 112px 32px; border-top: 1px solid #edf0ee; }
.gpt-container { max-width: 1120px; margin: 0 auto; }
.gpt-narrow { max-width: 840px; margin: 0 auto; }
.gpt-section h2, .gpt-close h2 { color: #171717; font-family: Geist, Inter, sans-serif; font-size: clamp(32px, 4.2vw, 52px); font-weight: 600; line-height: 1.12; letter-spacing: 0; }
.gpt-viewpoint { background: #f7f9f8; }
.gpt-viewpoint p { margin-top: 24px; color: #59645e; font-size: 17px; line-height: 1.85; }
.gpt-trust-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; align-items: center; gap: 72px; }
.gpt-trust-copy { min-width: 0; }
.gpt-trust-visual { width: 100%; max-width: 340px; margin: 0; overflow: hidden; border: 1px solid #e4eae6; border-radius: 20px; }
.gpt-trust-visual img, .gpt-system-visual img { display: block; width: 100%; height: auto; object-fit: cover; }
.gpt-system-visual img { height: 100%; }
.gpt-system-layout { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: stretch; gap: 28px; }
.gpt-system-visual { display: flex; min-width: 0; align-items: center; margin: 0; overflow: hidden; border: 1px solid #e4eae6; border-radius: 20px; background: #f5f5f5; }
.gpt-system .gpt-card { padding: 24px; }
.gpt-heading { max-width: 750px; margin: 0 auto 52px; text-align: center; }
.gpt-heading p { margin-top: 18px; color: #68756e; font-size: 16px; line-height: 1.7; }
.gpt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.gpt-card { min-width: 0; padding: 30px; border: 1px solid #e4eae6; border-radius: 14px; background: #fff; box-shadow: 0 8px 28px rgba(32,55,42,.035); }
.gpt-num { color: #4c9b70; font-size: 12px; font-weight: 700; }
.gpt-card h3, .gpt-reason h3 { margin-top: 18px; color: #171717; font-size: 20px; font-weight: 600; line-height: 1.35; }
.gpt-card p, .gpt-reason p { margin-top: 12px; color: #68736d; font-size: 15px; line-height: 1.75; }
.gpt-why { background: #fafbfa; }
.gpt-reasons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 60px; }
.gpt-reason { display: grid; grid-template-columns: 32px minmax(0,1fr); gap: 14px; padding: 28px 0; border-top: 1px solid #e3e9e5; }
.gpt-reason h3 { margin-top: 0; }
.gpt-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); border: 1px solid #e4eae6; border-radius: 14px; background: #f9fbfa; }
.gpt-stats span { padding: 25px 16px; text-align: center; font-size: 14px; font-weight: 600; }
.gpt-stats span + span { border-left: 1px solid #e4eae6; }
.gpt-links { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; margin-top: 28px; }
.gpt-links a { display: flex; flex-direction: column; gap: 12px; min-width: 0; padding: 24px; border: 1px solid #e4eae6; border-radius: 12px; }
.gpt-links a:hover { border-color: #a8ceba; }
.gpt-links strong { font-size: 15px; line-height: 1.5; }
.gpt-links strong span { color: #4c9b70; }
.gpt-links small { color: #748078; font-size: 13px; line-height: 1.6; }
.gpt-faq { background: #fafbfa; }
.gpt-faq h2 { text-align: center; }
.gpt-faq-list { margin-top: 48px; border-top: 1px solid #dfe6e1; }
.gpt-faq-item { border-bottom: 1px solid #dfe6e1; }
.gpt-faq-item button { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 20px; padding: 24px 0; border: 0; background: transparent; color: #202527; text-align: left; cursor: pointer; font-weight: 600; line-height: 1.5; }
.gpt-faq-item button span:last-child { color: #4c9b70; font-size: 24px; }
.gpt-faq-item p { padding: 0 34px 24px 0; color: #68736d; font-size: 15px; line-height: 1.75; }
.gpt-close { padding: 110px 32px; text-align: center; background: #f0f6f2; }
.gpt-close a { display: inline-flex; gap: 12px; margin-top: 28px; padding: 14px 22px; border-radius: 8px; background: #158a50; color: #fff; font-weight: 600; }
.gpt-page :deep(.site-footer) { margin-top: 0; padding-top: 72px; }
@media (max-width: 1000px) {
  .gpt-trust-layout { grid-template-columns: minmax(0, 1fr) 280px; gap: 36px; }
  .gpt-system-layout { grid-template-columns: 1fr; gap: 24px; }
  .gpt-system-visual { justify-content: center; }
}
@media (max-width: 760px) {
  .gpt-trust-layout { grid-template-columns: 1fr; gap: 32px; }
  .gpt-trust-visual { width: min(280px, 100%); justify-self: center; }
  .gpt-system-layout { gap: 24px; }
}
@media (max-width: 760px) { .gpt-hero { padding: 72px 20px; } .gpt-section { padding: 72px 20px; } .gpt-grid, .gpt-reasons, .gpt-links { grid-template-columns: 1fr; } .gpt-stats { grid-template-columns: repeat(2,minmax(0,1fr)); } .gpt-stats span:nth-child(3) { border-left: 0; } .gpt-stats span:nth-child(n+3) { border-top: 1px solid #e4eae6; } .gpt-preview { margin-top: 36px; } .gpt-card { padding: 24px; } .gpt-close { padding: 80px 20px; } }
</style>
