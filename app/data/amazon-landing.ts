// Copy for the dedicated Amazon landing page (app/components/AmazonLandingPage.vue).
// Claims stay at "IP is one signal among several"; nothing here promises an outcome.

export interface AmazonTextItem { title: string; body: string }
export interface AmazonChecklistCard { title: string; sub: string; cta: string; href: string; listTitle: string; items: string[] }

export interface AmazonLandingCopy {
  title: string
  description: string
  hero: { eyebrow: string; h1a: string; h1b: string; sub: string; cta: string; pill: string }
  live: { eyebrow: string; h2a: string; h2b: string; desc: string }
  detector: {
    tabNetwork: string; tabFlags: string; checkAnother: string
    clear: string; detected: string; readiness: string
    sideBody: string; prev: string; next: string
  }
  reads: { title: string; items: AmazonTextItem[] }
  why: {
    eyebrow: string; h2a: string; h2b: string; desc: string; cta: string; ctaHref: string
    mapLabel: string; mapIp: string; mapYou: string; mapOther: string; mapSuspended: string; mapSuspendedTag: string
    mapTitle: string; mapBody: string
    sideTitle: string; sideBody: string; rows: { k: string; v: string }[]
    gridTitle: string; items: AmazonTextItem[]
  }
  statement: { h2: string; body: string }
  networks: { eyebrow: string; items: { name: string; body: string }[]; cta1: string; cta2: string; cta2Href: string }
  quote: { text: string; source: string }
  report: {
    h2a: string; h2b: string; desc: string
    toggleA: string; toggleB: string
    sentence: { text: string; accent?: boolean }[]
    flags: { k: string; v: string; bad?: boolean }[]
    cards: AmazonTextItem[]
  }
  checklist: { h2a: string; h2b: string; cards: AmazonChecklistCard[] }
  batch: { h2a: string; h2b: string; desc: string; cardTitle: string; cardBody: string; bullets: string[]; cta: string; sample: string; cols: [string, string, string]; rows: { ip: string; type: string; score: number }[] }
  faq: { h2a: string; h2b: string; items: { question: string; answer: string }[] }
  links: { title: string; items: { label: string; href: string }[] }
  final: { h2: string; cta: string }
}

const sampleRows = (types: [string, string, string]) => [
  { ip: '203.0.113.24', type: types[0], score: 8 },
  { ip: '198.51.100.7', type: types[1], score: 64 },
  { ip: '192.0.2.61', type: types[2], score: 23 },
]

const en: AmazonLandingCopy = {
  title: 'Amazon Account Linked or Suspended? Check Your IP Risk First — IP Ready',
  description: 'Amazon seller account suspended, linked to a store you don\'t own, or stuck in registration review? Your IP is one of the signals Amazon correlates across accounts. Check its 12 network signals free — network type, shared-IP history, blacklist status — before you register or log in.',
  hero: {
    eyebrow: 'Amazon IP check · free, no signup',
    h1a: 'Is Your IP Putting',
    h1b: 'Your Amazon Store at Risk?',
    sub: 'On Amazon, an IP is never just yours. It can connect stores, registrations, and logins into one picture. See what your connection looks like before Amazon\'s systems do.',
    cta: 'Check my IP for free',
    pill: 'Run the live check',
  },
  live: {
    eyebrow: 'Live check',
    h2a: 'See Your Connection',
    h2b: 'Before Amazon\'s Systems Do',
    desc: 'The card below reads the connection you are on right now: the address, who operates it, what kind of network it is, and whether it carries proxy, VPN, Tor, or abuse flags. Amazon is the first platform on the right.',
  },
  detector: {
    tabNetwork: 'Network', tabFlags: 'Flags', checkAnother: 'Check another IP',
    clear: 'Clear', detected: 'Detected', readiness: 'Readiness',
    sideBody: 'How this connection reads to each platform, scored from the same signals. Use the arrows to compare.',
    prev: 'Previous platform', next: 'Next platform',
  },
  reads: {
    title: 'What the Check Reads',
    items: [
      { title: 'Network Type', body: 'Residential, business, mobile, or datacenter. A store run from a home or office line looks like a real operation. A hosting range looks like automation.' },
      { title: 'Address History', body: 'Recycled addresses carry recycled reputations. The check surfaces abuse reports attached to the IP, whoever caused them.' },
      { title: 'Anonymizer Flags', body: 'Proxy, VPN, Tor, and relay detection. These exits are shared by many strangers at once, which is the overlap a seller account wants to avoid.' },
      { title: 'Risk Score and Readiness', body: 'One 0–100 score that summarizes the signals, plus a per-platform readiness read with Amazon highlighted.' },
    ],
  },
  why: {
    eyebrow: 'Why Amazon flags your IP',
    h2a: 'Account Linkage Is',
    h2b: 'Amazon\'s Signature Enforcement',
    desc: 'One person or business generally runs one seller account, and accounts found to be related to a suspended store tend to be suspended with it. Amazon never publishes its full method, but the signals a system can correlate are the obvious ones: payment instruments, tax and address details, devices, and the network.',
    cta: 'How the Risk Score works',
    ctaHref: '/blog/what-is-ip-risk-score',
    mapLabel: 'Shared address',
    mapIp: '203.0.113.24',
    mapYou: 'Your store',
    mapOther: 'Agency client',
    mapSuspended: 'Unknown store',
    mapSuspendedTag: 'Suspended',
    mapTitle: 'One Address, Several Stores',
    mapBody: 'Every store touched from the same IP sits in the same network picture. If one of them is suspended, that overlap is visible.',
    sideTitle: 'How a Network Type Reads',
    sideBody: 'The same store looks different depending on the line it is run from.',
    rows: [
      { k: 'Residential', v: 'a household' },
      { k: 'Business line', v: 'a company premises' },
      { k: 'Mobile', v: 'a phone on carrier data' },
      { k: 'Datacenter', v: 'hosting, automation' },
      { k: 'VPN exit', v: 'many strangers at once' },
    ],
    gridTitle: 'Where the Risk Comes From',
    items: [
      { title: 'The "Clean" IP You Bought May Have a Past', body: 'Datacenter and static IPs sold as account infrastructure are recycled. The dedicated address you received this month may have carried someone else\'s store last quarter, possibly a suspended one.' },
      { title: 'Registration Review Starts with the Network', body: 'New seller accounts go through identity, tax, and sometimes video verification. A registration arriving from a hosting range starts that process under suspicion, and extra checks cluster there.' },
      { title: 'Shared Working Networks Connect Strangers', body: 'Offices, warehouses, coworking spaces, and agencies put many stores behind one public IP. This is how sellers get linked to stores they have never heard of.' },
      { title: 'Buyer Accounts Are Caught by the Same Signals', body: 'On flagged shared exits, buyers see cancelled orders, locked accounts, and payment reviews. Ordinary shopping can inherit an address\'s reputation.' },
    ],
  },
  statement: {
    h2: 'One Store, One Stable IP',
    body: 'Rotating addresses across countries reads as several operators, not one business. Pick a clean connection, check it, and keep the store on it.',
  },
  networks: {
    eyebrow: 'Who Else Is Behind Your IP?',
    items: [
      { name: 'Home Broadband', body: 'Usually the cleanest picture: one household, one line. Check it anyway, because ISPs reassign addresses and some home ranges are resold as proxy exits.' },
      { name: 'Office Network', body: 'Everyone in the building leaves through one public IP. Any seller account a colleague opens from that line shares the address with yours.' },
      { name: 'Coworking Space', body: 'Dozens of unrelated businesses on a single connection. You cannot know which of them sell on Amazon, or which have been suspended.' },
      { name: 'Agency Partner', body: 'An agency that logs into several clients\' Seller Central accounts from one line puts all of those stores on the same address.' },
      { name: 'Warehouse or 3PL', body: 'Shared prep centers and warehouses often run many sellers\' logins through the same router.' },
      { name: 'Datacenter IP', body: 'Sold as account infrastructure, read as hosting. The address may have carried someone else\'s store before it reached you.' },
      { name: 'VPN Exit', body: 'Thousands of users share a handful of exits, and abuse from any one of them attaches to the address.' },
      { name: 'Mobile Data', body: 'Carrier NAT puts many phones behind one IP, and that IP changes often. Fine for a quick look, unstable as a store\'s home base.' },
    ],
    cta1: 'Check this connection',
    cta2: 'Compare IP types',
    cta2Href: '/blog/residential-vs-datacenter-vs-mobile-ip',
  },
  quote: {
    text: 'An IP is never just yours. On Amazon it can connect stores, registrations, and logins into one picture, and the network is the part of that picture you can actually inspect.',
    source: 'The idea behind this check',
  },
  report: {
    h2a: 'Know What the Report Says',
    h2b: 'Before You Log In',
    desc: 'Three reads matter most for a seller account: what kind of network this is, how the address scores, and which flags it carries.',
    toggleA: 'Residential',
    toggleB: 'Datacenter',
    sentence: [
      { text: '"A score in the ' },
      { text: 'low range', accent: true },
      { text: ', no anonymizer detected, and ' },
      { text: 'no abuse history', accent: true },
      { text: '."' },
    ],
    flags: [
      { k: 'Proxy', v: 'Clear' },
      { k: 'VPN', v: 'Clear' },
      { k: 'Tor', v: 'Clear' },
      { k: 'Abuse', v: 'Detected', bad: true },
    ],
    cards: [
      { title: 'Network Type', body: 'Shows whether the line reads as a home, a business, a mobile carrier, or a hosting provider.' },
      { title: 'Risk Score', body: 'A 0–100 summary. Amazon publishes no cutoff, but low scores with clean flags are what long-running stores usually sit on.' },
      { title: 'Signal Flags', body: 'Each flag is listed separately, so you see exactly what an address carries instead of a single verdict.' },
    ],
  },
  checklist: {
    h2a: 'A Checklist for the Connection',
    h2b: 'Your Store Depends On',
    cards: [
      {
        title: 'Before You Register', sub: 'New store', cta: 'Check this connection', href: '#scan', listTitle: 'Do this first:',
        items: ['Run the check on the exact line you will register from', 'Confirm the network type is not datacenter', 'Look up abuse history on any IP you were sold', 'Remember the registration environment stays on the account\'s record'],
      },
      {
        title: 'While You Run the Store', sub: 'Day to day', cta: 'Check a list of IPs', href: '/batch-check', listTitle: 'Keep doing this:',
        items: ['Keep one stable IP per store', 'Count who else uses the connection', 'Use the Seller Central line, not your phone\'s data', 'Avoid rotating addresses across countries'],
      },
      {
        title: 'When Something Changes', sub: 'New IP, office, or agency', cta: 'Read the IP type guide', href: '/blog/residential-vs-datacenter-vs-mobile-ip', listTitle: 'Check again when:',
        items: ['You buy or are assigned a new IP', 'You move office or warehouse', 'An agency or new teammate starts logging in', 'Your ISP or router is replaced'],
      },
    ],
  },
  batch: {
    h2a: 'More Than One Address?',
    h2b: 'Check Them Together',
    desc: 'Batch check reads a whole list of IPs in one pass, so every address can be vetted before a store is tied to it.',
    cardTitle: 'Batch IP Check',
    cardBody: 'Paste the addresses you were sold or assigned and compare them side by side.',
    bullets: ['Network type and Risk Score for every address', 'Abuse and anonymizer flags per IP', 'Spot the recycled address before you use it'],
    cta: 'Open batch check',
    sample: 'Sample output',
    cols: ['IP address', 'Network', 'Risk'],
    rows: sampleRows(['Residential', 'Datacenter', 'Business']),
  },
  faq: {
    h2a: 'Frequently',
    h2b: 'Asked Questions',
    items: [
      { question: 'Can Amazon link two seller accounts just because they share an IP?', answer: 'Amazon doesn\'t publish its method, and IP alone is one signal among several: payment, tax, address, and device overlaps matter too. But a shared IP is a real, visible overlap, and sellers are routinely surprised by linkage after sharing networks with other stores. What your IP looks like, and who else is behind it, is the part of the picture you can actually inspect.' },
      { question: 'My account was suspended for being "related" to another store. Was it the IP?', answer: 'Possibly, but not provably from outside. Related-account suspensions also come from shared payment instruments, addresses, or business details. The network is worth ruling in or out: if your store ever shared an IP with other sellers through an agency, an office, or a bought "clean" IP, that is a plausible thread, and the check shows the signals that address currently carries.' },
      { question: 'Is a datacenter or static IP safer for running my store?', answer: 'Not automatically. Static helps with stability, but a datacenter address still reads as hosting infrastructure, which is the profile of automation rather than a business premises. What matters is the combination: network type, the address\'s history, and whether other stores have used it. Run the check on the exact IP before you commit a store to it.' },
      { question: 'What Risk Score should my store\'s IP have?', answer: 'There is no official cutoff, because Amazon doesn\'t publish one. Stores run for years on ordinary connections whose IPs score in the low range with no anonymizer detection and no blacklist history. Mid-to-high scores, datacenter type, or a past on the address are where linkage and review risk concentrate.' },
      { question: 'Does a clean result mean my account won\'t be linked?', answer: 'No. The check reads the network, and the network is one signal among several. Payment instruments, tax and address details, and devices are correlated too, and none of those are visible here. A clean result removes one known risk. It does not guarantee an outcome.' },
      { question: 'Which connection should I run the check on?', answer: 'The exact one you use for Seller Central. The result describes the line you are on at this moment, so checking from your phone\'s data or a different Wi-Fi tells you about that network, not your store\'s.' },
      { question: 'How often should I re-check?', answer: 'Whenever the address may have changed: after an ISP or router change, an office move, a new proxy or static IP purchase, or when someone starts logging in from another location. Home broadband addresses are also reassigned from time to time.' },
      { question: 'Do buyer accounts have the same problem?', answer: 'They can. Buyer accounts on flagged shared exits see cancelled orders, locked accounts, and payment reviews, because high-volume abuse also runs through those addresses. If your household or office IP is a recycled VPN or datacenter exit, ordinary shopping can inherit its reputation.' },
      { question: 'Is the check free? Do I need an account?', answer: 'It is free and there is no signup. The check on this page runs automatically on the connection you are visiting from.' },
    ],
  },
  links: {
    title: 'Keep Reading',
    items: [
      { label: 'Residential vs datacenter IP for seller accounts', href: '/blog/residential-vs-datacenter-vs-mobile-ip' },
      { label: 'Check if your IP is blacklisted', href: '/blog/why-is-my-ip-blacklisted' },
      { label: 'How the Risk Score works', href: '/blog/what-is-ip-risk-score' },
      { label: 'Check another IP', href: '/' },
    ],
  },
  final: { h2: 'Check the IP Before You Register or Log In', cta: 'Run the free check' },
}

const zh: AmazonLandingCopy = {
  title: '亚马逊账号被关联或停用？先免费检测你的 IP 风险 — IP Ready',
  description: '亚马逊卖家账号被停用、被关联到不认识的店铺，或者卡在注册审核？IP 是亚马逊跨账号比对的信号之一。免费检测它的 12 个网络信号——网络类型、共享 IP 历史、黑名单状态——注册或登录之前先查。',
  hero: {
    eyebrow: '亚马逊 IP 检测 · 免费，无需注册',
    h1a: '你的 IP 正在给',
    h1b: '亚马逊店铺埋雷吗？',
    sub: '在亚马逊，一个 IP 从来不只属于你一个人：它能把店铺、注册和登录串成一张图。先看清你的连接长什么样，再让亚马逊的系统看。',
    cta: '免费检测我的 IP',
    pill: '运行实时检测',
  },
  live: {
    eyebrow: '实时检测',
    h2a: '先看清你的连接',
    h2b: '再让亚马逊的系统看',
    desc: '下面这张卡片读取的是你此刻正在使用的连接：IP 地址、运营商、网络类型，以及它是否带有代理、VPN、Tor 或滥用标记。右侧卡片默认显示 Amazon。',
  },
  detector: {
    tabNetwork: '网络', tabFlags: '标记', checkAnother: '检测另一个 IP',
    clear: '正常', detected: '检出', readiness: '就绪度',
    sideBody: '同一组信号下，这条连接在各个平台眼里是什么样子。用左右箭头切换对比。',
    prev: '上一个平台', next: '下一个平台',
  },
  reads: {
    title: '检测会读取什么',
    items: [
      { title: '网络类型', body: '住宅、商用、移动还是机房。从家庭或办公线路运营的店铺，看起来是真实经营；机房段看起来则像自动化。' },
      { title: '地址历史', body: '回收的地址带着回收的信誉。无论是谁造成的，检测都会显示这个 IP 身上的滥用记录。' },
      { title: '匿名代理标记', body: '代理、VPN、Tor 和中继检测。这类出口同时被大量陌生人共用，正是卖家账号要避开的那种重叠。' },
      { title: 'Risk Score 与平台就绪度', body: '一个 0–100 的分数汇总所有信号，并给出各平台的就绪度，其中 Amazon 高亮显示。' },
    ],
  },
  why: {
    eyebrow: '为什么 Amazon 会盯上你的 IP',
    h2a: '账号关联是亚马逊',
    h2b: '最有名的执法方式',
    desc: '一个人或一家企业通常只能运营一个卖家账号，被判定与已停用店铺「关联」的账号，往往会被一起停用。亚马逊从未公开完整的判定方法，但系统能比对的信号就是那些显而易见的：支付工具、税务与地址信息、设备，以及网络。',
    cta: 'Risk Score 是怎么算的',
    ctaHref: '/blog/what-is-ip-risk-score',
    mapLabel: '共用的地址',
    mapIp: '203.0.113.24',
    mapYou: '你的店铺',
    mapOther: '代运营的另一个客户',
    mapSuspended: '陌生店铺',
    mapSuspendedTag: '已停用',
    mapTitle: '一个地址，多个店铺',
    mapBody: '从同一个 IP 碰过的每一个店铺，都在同一张网络图里。只要其中一个被停用，这层重叠就看得见。',
    sideTitle: '不同网络类型读起来像什么',
    sideBody: '同一个店铺，从不同线路运营，看起来完全不一样。',
    rows: [
      { k: '住宅宽带', v: '一个家庭' },
      { k: '商用专线', v: '一家企业的场所' },
      { k: '移动网络', v: '一部用流量的手机' },
      { k: '机房 IP', v: '托管与自动化' },
      { k: 'VPN 出口', v: '一大群陌生人' },
    ],
    gridTitle: '风险从哪里来',
    items: [
      { title: '你买来的「干净」IP 可能有前科', body: '作为账号基础设施出售的机房 IP 和静态 IP 是循环使用的。你这个月拿到的「独享」IP，上个季度可能挂着别人的店铺，甚至是一个被停用的店铺。' },
      { title: '注册审核从网络环境开始看', body: '新卖家账号要过身份、税务，有时还有视频验证。来自机房段的注册请求，从一开始就在怀疑中进行，额外的核查也集中在那里。' },
      { title: '共享的办公网络把陌生人串起来', body: '办公室、仓库、共享办公空间、代运营公司，都会把很多店铺放到同一个公网 IP 后面。很多卖家就是这样被关联到素未谋面的店铺。' },
      { title: '买家号也会被同样的信号误伤', body: '在被标记的共享出口上，买家会遇到订单取消、账号锁定和支付审核。正常购物也会继承一个地址的信誉。' },
    ],
  },
  statement: {
    h2: '一个店铺，一个稳定的 IP',
    body: '地址在不同国家之间轮换，看起来像多个运营者，而不是一家企业。选一条干净的连接，检测它，然后让店铺一直用它。',
  },
  networks: {
    eyebrow: '你的 IP 背后还有谁？',
    items: [
      { name: '家庭宽带', body: '通常是最干净的情况：一个家庭，一条线路。但仍然值得查一遍，因为运营商会重新分配地址，有些住宅段还会被转卖成代理出口。' },
      { name: '办公室网络', body: '整栋楼的人都从同一个公网 IP 出去。同事从这条线路打开的任何卖家账号，都和你的店铺共用这个地址。' },
      { name: '共享办公空间', body: '几十家互不相干的公司共用一条连接。你无从知道其中谁在做亚马逊，谁又已经被停用。' },
      { name: '代运营公司', body: '代运营从同一条线路登录多个客户的 Seller Central，就等于把这些店铺都放在了同一个地址上。' },
      { name: '仓库与第三方物流', body: '共享的备货中心和仓库，常常让许多卖家的登录都经过同一台路由器。' },
      { name: '机房 IP', body: '卖的时候叫账号基础设施，读起来是托管。这个地址到你手上之前，可能已经挂过别人的店铺。' },
      { name: 'VPN 出口', body: '成千上万的用户共用少数几个出口，其中任何一个人的滥用都会记在这个地址上。' },
      { name: '手机流量', body: '运营商级 NAT 让大量手机共用一个 IP，而且这个 IP 经常变。临时看一眼可以，当店铺的固定环境就不稳定。' },
    ],
    cta1: '检测当前连接',
    cta2: '对比 IP 类型',
    cta2Href: '/blog/residential-vs-datacenter-vs-mobile-ip',
  },
  quote: {
    text: '一个 IP 从来不只属于你一个人。在亚马逊，它能把店铺、注册和登录串成一张图，而网络恰好是这张图里你真正能查清的部分。',
    source: '这项检测背后的想法',
  },
  report: {
    h2a: '登录之前',
    h2b: '先读懂这份报告',
    desc: '对卖家账号来说，最重要的是三项：这是什么类型的网络、这个地址得多少分、它身上带着哪些标记。',
    toggleA: '住宅',
    toggleB: '机房',
    sentence: [
      { text: '「分数在' },
      { text: '低区间', accent: true },
      { text: '，没有检出匿名代理，也' },
      { text: '没有滥用记录', accent: true },
      { text: '。」' },
    ],
    flags: [
      { k: 'Proxy', v: '正常' },
      { k: 'VPN', v: '正常' },
      { k: 'Tor', v: '正常' },
      { k: 'Abuse', v: '检出', bad: true },
    ],
    cards: [
      { title: '网络类型', body: '显示这条线路读起来是家庭、企业、移动运营商，还是托管服务商。' },
      { title: 'Risk Score', body: '0–100 的汇总分数。亚马逊没有公布分数线，但长期稳定运营的店铺，IP 通常分数低、标记干净。' },
      { title: '信号标记', body: '每个标记单独列出，你看到的是这个地址具体背着什么，而不是一个笼统的结论。' },
    ],
  },
  checklist: {
    h2a: '给店铺所依赖的那条连接',
    h2b: '做一份自查清单',
    cards: [
      {
        title: '注册之前', sub: '新店铺', cta: '检测当前连接', href: '#scan', listTitle: '先做这些：',
        items: ['在准备用来注册的那条线路上跑一遍检测', '确认网络类型不是机房', '查一查买来的 IP 有没有滥用记录', '记住：注册环境会留在账号的记录里'],
      },
      {
        title: '日常运营', sub: '每天都适用', cta: '批量检测一组 IP', href: '/batch-check', listTitle: '一直保持：',
        items: ['一个店铺长期固定一个 IP', '数一数还有谁在用这条连接', '用登录 Seller Central 的线路检测，而不是手机流量', '不要让地址在不同国家之间轮换'],
      },
      {
        title: '环境变化时', sub: '换 IP、换办公室、换代运营', cta: '阅读 IP 类型指南', href: '/blog/residential-vs-datacenter-vs-mobile-ip', listTitle: '以下情况重新检测：',
        items: ['买了或被分配了新的 IP', '搬了办公室或仓库', '代运营或新同事开始登录', '更换了运营商或路由器'],
      },
    ],
  },
  batch: {
    h2a: '手上不止一个地址？',
    h2b: '放在一起检测',
    desc: '批量检测一次读取整组 IP，在把店铺绑到某个地址之前，先把每一个都查清楚。',
    cardTitle: '批量 IP 检测',
    cardBody: '把买来或分配到的地址粘贴进去，并排对比。',
    bullets: ['每个地址的网络类型和 Risk Score', '逐个 IP 的滥用与匿名代理标记', '在使用之前找出回收来的地址'],
    cta: '打开批量检测',
    sample: '示例输出',
    cols: ['IP 地址', '网络类型', '风险'],
    rows: sampleRows(['住宅', '机房', '商用']),
  },
  faq: {
    h2a: '常见',
    h2b: '问题',
    items: [
      { question: '两个卖家账号只因为共用 IP 就会被关联吗？', answer: '亚马逊不公开判定方法，IP 本身也只是诸多信号之一，支付、税务、地址、设备的重叠同样重要。但共用 IP 是真实、可见的重叠，卖家因为和别的店铺共用网络而被关联的情况并不少见。你的 IP 长什么样、背后还有谁，是这张图里你真正能查清的部分。' },
      { question: '我的账号因「关联」另一个店铺被停用，是 IP 的原因吗？', answer: '有这个可能，但从外部无法证实：关联停用也可能来自共用的支付工具、地址或企业信息。网络这一环值得排查。如果你的店铺曾经通过代运营、办公室或买来的「干净」IP 和别的卖家共用过地址，这就是一条成立的线索，检测能看到这个地址现在背着哪些信号。' },
      { question: '用机房 IP 或静态 IP 运营店铺更安全吗？', answer: '不一定。静态能解决稳定性，但机房地址读起来仍然是托管基础设施，是自动化的画像，不是经营场所的样子。重要的是组合：网络类型、地址的历史，以及有没有别的店铺用过它。把店铺绑到某个 IP 之前，先拿它跑一遍检测。' },
      { question: '店铺用的 IP，Risk Score 多少合适？', answer: '没有官方分数线，亚马逊没有公布过。用普通连接运营多年的店铺，其 IP 通常分数在低区间、没有匿名代理检出、没有黑名单记录。分数中高、机房类型，或地址带前科，才是关联和审核风险集中的地方。' },
      { question: '检测结果干净，就代表账号不会被关联吗？', answer: '不代表。检测读取的是网络，而网络只是诸多信号之一。支付工具、税务与地址信息、设备同样会被比对，这些在这里都看不到。结果干净，是排除了一项已知风险，并不保证最终结果。' },
      { question: '应该在哪条连接上检测？', answer: '就是你实际登录 Seller Central 的那一条。检测结果描述的是你此刻所在的线路，用手机流量或另一个 Wi-Fi 检测，得到的是那个网络的情况，而不是店铺的。' },
      { question: '多久需要重新检测一次？', answer: '只要地址可能变了就查：更换运营商或路由器、搬办公室、新买了代理或静态 IP，或者有人开始从别的地点登录。家庭宽带的地址也会不定期被重新分配。' },
      { question: '买家号也有同样的问题吗？', answer: '有可能。在被标记的共享出口上，买家号会遇到订单被取消、账号被锁定、支付被审核，因为大批量的滥用也从这类地址发出。如果你的家庭或公司 IP 是回收来的 VPN 或机房出口，正常购物也会继承它的信誉。' },
      { question: '检测收费吗？需要注册账号吗？', answer: '免费，也不用注册。本页的检测会在你当前访问所用的连接上自动运行。' },
    ],
  },
  links: {
    title: '延伸阅读',
    items: [
      { label: '卖家账号该用住宅 IP 还是机房 IP', href: '/blog/residential-vs-datacenter-vs-mobile-ip' },
      { label: '查一下你的 IP 是否进了黑名单', href: '/blog/why-is-my-ip-blacklisted' },
      { label: 'Risk Score 是怎么算的', href: '/blog/what-is-ip-risk-score' },
      { label: '检测另一个 IP', href: '/' },
    ],
  },
  final: { h2: '注册店铺或登录之前，先把 IP 查一遍', cta: '免费检测' },
}

export const amazonLanding: { en: AmazonLandingCopy; zh: AmazonLandingCopy } = { en, zh }
