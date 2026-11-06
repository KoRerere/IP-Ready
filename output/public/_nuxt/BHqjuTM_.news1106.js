import{$n as e,Er as t,G as n,Gt as r,H as i,Nt as a,Q as o,Sr as s,U as c,Un as l,V as u,W as d,X as f,Z as p,et as m,j as h,n as g,zt as _}from"./BJJqepEs.js";import{t as v}from"./otVYgH2v.js";import{t as y}from"./CQMnziXA.news1106.js";import{i as b,n as x,r as S,t as C}from"./BqJrR-8D.news1106.js";import{t as w}from"./BDNMzG2s.js";import{t as T}from"./DQynAwdz.js";import{a as E,d as D,n as O,r as k,s as ee,t as A,u as j}from"./BuSybzV-.js";import{t as M}from"./qfpJzYdO.js";var N=`# Landing Page Draft — ChatGPT IP Check (样稿，未发布）

平台：ChatGPT
主目标词（EN): chatgpt ip blocked / why is chatgpt blocking my ip
主目标词（ZH): ChatGPT IP 被封 / ChatGPT 无法使用 IP

---

# EN — Full page copy

## URL & meta

- **Suggested URL:** \`/chatgpt-ip-check\`
- **Title:** ChatGPT IP Blocked? Check Your IP Risk Score Free — IP Ready
- **Meta description:** ChatGPT blocking your IP or looping on verification? Run a free check on the 12 network signals behind your connection — proxy/VPN detection, blacklist status, ASN reputation — and see your ChatGPT readiness before you sign in.

## Hero

- **H1:** Is ChatGPT Blocking Your IP?
- **Sub:** Most "unusual activity" warnings and endless verification loops start with the IP, not the account. Check the network signals ChatGPT's systems can see — free, no signup.
- **Detector:** [The site's standard check card is embedded here, same component as the homepage: visitor IP, Risk Score, signal cards, and the platform readiness list with ChatGPT highlighted.]
- **CTA under the card:** See what ChatGPT sees in your connection ↑ (scrolls to / runs the embedded check)

## Why ChatGPT flags your IP

### 1. Datacenter and hosting ranges
ChatGPT is served through heavy bot-mitigation layers. IPs from cloud and hosting ranges (AWS, GCP, small VPS providers) are treated as automated traffic by default, even when a real person is behind them. A business or datacenter network type is one of the fastest ways to land in extra verification.

### 2. VPN and proxy exits shared by thousands
A popular VPN exit is shared by thousands of users at once. If a handful of them triggered abuse systems, the exit's reputation drops for everyone — you inherit the history of strangers. The same applies to public proxies and Tor exits, which are blocked outright in many cases.

### 3. Blacklist and abuse history on the address
IPs get recycled. The address your ISP or VPN assigns you today may carry abuse reports from a previous user. When that history shows up in the blacklist and abuse feeds, ChatGPT's risk systems see it before you type a single prompt.

### 4. Region and timezone mismatch
Your account's usual country, your IP's geolocation, and your device timezone telling three different stories is a classic anomaly signal. It often shows up as "ChatGPT is not available in your country" errors or sudden verification challenges mid-session.

### 5. Sudden IP changes mid-session
Switching VPN servers, toggling a proxy, or moving between networks during an active session can invalidate the session and force re-verification. Rapid IP hopping looks like session hijacking to automated defenses.

## Self-check checklist

1. Run the check above and look at your **network type** — if it reads datacenter or hosting, that's your prime suspect.
2. Check the **Proxy / VPN / Tor** signal cards: any "Detected" result means ChatGPT likely sees the same.
3. Check your **blacklist and abuse status** — a listing from a previous user of this IP can follow the address, not you.
4. Compare the **IP location with your device timezone**. A mismatch is easy to fix (align the timezone, or use an exit in the right region).
5. If you're on a VPN, try a **different, less crowded exit** or your regular connection, then re-run the check to see if the score improves.
6. Keep **one stable IP per session** — don't switch servers or networks while logged in.

## ### FAQ

**Why does ChatGPT say "unusual activity" and keep asking me to verify?**
That message usually means the risk systems scored your connection, not your account history. Datacenter IPs, shared VPN exits, and addresses with abuse history are the most common triggers. Run the free check above to see which of those signals your current IP carries.

**Can a VPN cause ChatGPT to block me?**
Yes. A VPN doesn't hide your network type — it replaces it with the VPN's. If the exit is a flagged datacenter range or shared by flagged users, ChatGPT may challenge or block it more aggressively than your home connection.

**ChatGPT says it's not available in my country, but I'm in a supported region. Why?**
Usually a geolocation mismatch: your exit IP resolves to a different country than you're actually in (common with VPNs and some mobile carriers). Check the location your IP reports above and switch to an exit that resolves to your real region.

**What Risk Score is safe for ChatGPT?**
There's no official cutoff — OpenAI doesn't publish one. As a working guide, scores in the low range with no proxy/VPN detection and no blacklist hits behave like ordinary home connections. A mid or high score with a datacenter network type is where challenges typically start.

## Internal links

- → **Why ChatGPT and Claude block your IP** (\`/blog/why-chatgpt-claude-blocking-your-ip\`) — anchor: "why ChatGPT and Claude block your IP"
- → **What is an IP risk score?** (\`/blog/what-is-ip-risk-score\`) — anchor: "how the Risk Score works"
- → **Why is my IP blacklisted?** (\`/blog/why-is-my-ip-blacklisted\`) — anchor: "check if your IP is blacklisted"
- → **Homepage check** (\`/\`) — anchor: "check another IP"

## How this page differs from the blog post

The blog post *Why ChatGPT and Claude Block Your IP* explains the principles — how platform risk systems weigh network signals. This landing page is a tool page: it leads with the working checker, a ChatGPT-specific symptom list, and a step-by-step self-check, and links out to the blog for the deeper explanation instead of repeating it.

---

# ZH — 全套文案

## URL 与 meta

- **建议 URL：** \`/chatgpt-ip-check\`（与 EN 共用同一 URL，页面内切换语言，与站内现行双语文章的做法一致）
- **Title：** ChatGPT IP 被封？免费检测你的 IP 风险分 — IP Ready
- **Meta description：** ChatGPT 提示异常活动、反复人机验证，或者干脆打不开？免费检测你连接背后的 12 个网络信号——代理/VPN 识别、黑名单状态、ASN 信誉——登录之前先看看你的 ChatGPT readiness。

## Hero

- **H1：** ChatGPT 把你的 IP 拦下来了吗？
- **副文案：** 大多数「异常活动」提示和没完没了的验证循环，问题出在 IP，不在账号。先把 ChatGPT 系统能看到的网络信号查清楚——免费，不用注册。
- **检测器：** [此处嵌站内同款检测卡，与首页同一组件：访客 IP、Risk Score、信号卡，以及平台 readiness 列表，其中 ChatGPT 一项高亮。]
- **卡片下方 CTA：** 看看 ChatGPT 眼里你的连接是什么样 ↑（滚动到 / 触发上方检测卡）

## 为什么 ChatGPT 会拦你的 IP

### 1. 机房和托管 IP 段
ChatGPT 前面挡着很重的机器人防护层。云服务器和托管机房段的 IP（AWS、GCP、各种小 VPS) 默认就被当成自动化流量，哪怕背后是真人。网络类型显示为 business 或 datacenter，是触发额外验证最快的方式之一。

### 2. 成千上万人共用的 VPN / 代理出口
热门 VPN 出口同时被成千上万个用户共用。只要其中一小部分人触发过滥用系统，这个出口的信誉就被所有人一起拖下水——你在替陌生人的历史买单。公共代理和 Tor 出口也一样，很多情况下会被直接拦截。

### 3. 这个 IP 的黑名单与滥用历史
IP 是循环使用的。你今天被 ISP 或 VPN 分到的地址，可能带着上一个用户的滥用记录。这段历史一旦出现在黑名单和滥用数据库里，你还没输入第一条 prompt,ChatGPT 的风控就已经看到了。

### 4. 地区与时区对不上
账号常用国家、IP 的地理位置、设备时区——三者讲三个故事，是最经典的异常信号。表现出来就是「ChatGPT 在你所在的国家不可用」这类报错，或者会话中途突然弹出验证。

### 5. 会话中途频繁换 IP
在已登录的会话里切换 VPN 节点、开关代理、换网络，都可能让会话失效并强制重新验证。短时间内 IP 跳来跳去，在自动防护系统眼里很像会话劫持。

## 自查清单

1. 先跑一遍上方检测，看**网络类型**——如果显示 datacenter 或 hosting，这就是头号嫌疑。
2. 看 **Proxy / VPN / Tor** 三张信号卡：任何一张显示「Detected」,ChatGPT 那边大概率看到的也是同样结果。
3. 查**黑名单与滥用状态**——这个 IP 上一个用户留下的记录，跟的是地址，不是你这个人。
4. 把 **IP 所在地和设备时区**对一下。不一致很好修：改时区，或者换一个地区对得上的出口。
5. 如果在用 VPN，换一个**没那么拥挤的节点**，或者切回自己的常规网络，再测一次看分数有没有变好。
6. **一个会话固定一个 IP**——登录状态下不要切节点、不要换网络。

## ### 常见问题

**为什么 ChatGPT 老是提示「异常活动」，还要我反复验证？**
这类提示通常说明风控给你的连接打了分，而不是你的账号有问题。机房 IP、共用 VPN 出口、带滥用历史的地址是最常见的三个触发点。跑一遍上面的免费检测，就能看到你当前的 IP 中了哪几条。

**用 VPN 会导致 ChatGPT 封我吗？**
会。VPN 并不会隐藏你的网络类型，只是把它换成了 VPN 出口的类型。如果出口是被标记过的机房段，或者和被标记的用户共用，ChatGPT 对它的验证和拦截反而可能比你的家庭宽带更严。

**我明明在支持的地区，为什么提示 ChatGPT 不可用？**
多半是地理位置对不上：你的出口 IP 被解析到了另一个国家（VPN 和部分移动网络很常见）。先看上面检测出的 IP 所在地，再换一个解析到你真实地区的出口。

**Risk Score 多少对 ChatGPT 才算安全？**
没有官方分数线——OpenAI 没有公布过。经验上：分数在低区间、没有代理/VPN 检出、没有黑名单记录的 IP，表现和普通家庭连接无异；分数中高、再加上 datacenter 网络类型，就是验证开始找上门的地方。

## 内链建议

- → **Why ChatGPT and Claude Block Your IP**(\`/blog/why-chatgpt-claude-blocking-your-ip\`)——锚文本：「为什么 ChatGPT 和 Claude 会封你的 IP」
- → **What Is an IP Risk Score**(\`/blog/what-is-ip-risk-score\`)——锚文本：「Risk Score 是怎么算的」
- → **Why Is My IP Blacklisted**(\`/blog/why-is-my-ip-blacklisted\`)——锚文本：「查一下你的 IP 是否进了黑名单」
- → **首页检测**（\`/\`）——锚文本：「检测另一个 IP」

## 本页与博客文的区别

博客文《Why ChatGPT and Claude Block Your IP》讲原理——平台风控如何权衡网络信号。这一页是工具页：开头就是能用的检测器，配 ChatGPT 专属的症状清单和一步步的自查流程，原理部分链回博客，不重复展开。

---

## 待 Koray 确认

1. **URL 命名**：用了 \`/chatgpt-ip-check\`（短、带核心词）。备选是 \`/chatgpt-ip-blocked\`（更贴搜索原话，但语气偏「出事后」）——样稿按前者写的，改名只需替换 URL 与 title 中的词序。
2. **目标词取舍**：EN 主攻 \`chatgpt ip blocked\` + \`why is chatgpt blocking my ip\` 两个意图，没有去抢 \`chatgpt unblocked\` 这类灰词——那批词的用户意图偏绕过手段，落地页承诺不了也不该承诺。ZH 主攻「ChatGPT IP 被封」而非「ChatGPT 无法使用」，因为前者更接近用户出问题时实际会搜的说法；「无法使用」流量更大但意图杂（包含宕机、账号问题），样稿里只在 meta 里轻轻带了一次。
3. **FAQ 第四问的口径**：正面回答了「多少分安全」，但明确写了没有官方线、只给经验区间。如果 Koray 不想在落地页上出现任何近似分数线的表述，这条可以改成纯信号导向的回答（只看检出项，不提分数区间）。
`,P=`# Landing Page Draft — Claude IP Check (样稿，未发布）

平台：Claude
主目标词（EN): claude ip blocked / can't sign up for claude vpn
主目标词（ZH): Claude 注册不了 IP / Claude 无法注册 风控

---

# EN — Full page copy

## URL & meta

- **Suggested URL:** \`/claude-ip-check\`
- **Title:** Claude Blocking Your IP? Check Your IP Before You Sign Up — IP Ready
- **Meta description:** Claude signup failing, account flagged at registration, or organization disabled? Anthropic gates accounts at sign-up, and your IP is the first thing it sees. Check 12 network signals — network type, proxy/VPN detection, blacklist status — free, before you register.

## Hero

- **H1:** Check Your IP Before Claude Does
- **Sub:** With Claude, the IP check happens at the door: many accounts are stopped at signup or first login, before a single chat. See the same network signals — free, no signup (for the check, anyway).
- **Detector:** [The site's standard check card is embedded here, same component as the homepage: visitor IP, Risk Score, signal cards, and the platform readiness list with Claude highlighted.]
- **CTA under the card:** Run it before you register — a flagged IP is much harder to fix after the account exists.

## Why Claude flags your IP

### 1. The gate is at signup, not after
Chat platforms often let you in and judge later; Claude front-loads its checks. Registration and first login are where datacenter IPs, anonymizer exits, and bad-reputation addresses get stopped. Many users never see an error that mentions IP at all — just a signup that won't complete or an account that arrives already restricted, sometimes surfacing later as an "organization disabled" notice.

### 2. Unsupported region is a hard stop
Claude is only officially available in a set list of countries. If your IP geolocates to an unsupported region, signup is blocked outright — and reaching Claude through an exit in a supported country while living elsewhere puts the account itself at risk, because the mismatch is exactly what the location checks look for.

### 3. Datacenter and VPN exits get extra scrutiny at registration
A hosting-range IP creating a brand-new account is one of the highest-risk combinations there is. VPN exits face the same problem at signup that they face everywhere — thousands of strangers share the exit, and its reputation is the worst of all of them — but Claude's registration flow is where that reputation matters most.

### 4. Shared IP abuse history
Dorms, offices, coworking networks, and carrier-grade NAT (CGNAT) pools put many users behind one address. If others on that address abused accounts or automation, a fresh signup from the same IP can inherit the suspicion — same mechanism as MaxMind's shared-IP problem: the platform sees the address's history, not your intentions.

### 5. IP instability across the account's life
Registering in one country, logging in from another the next week, and rotating VPN servers in between is a pattern risk systems read as account trading or hijacking. Claude accounts tend to fare best on one stable, residential connection whose location never changes.

## Self-check checklist

1. Run the check above **before** you create the account — with Claude, order matters.
2. Confirm the **IP location is a country where Claude is officially available**, and that it's the country you're actually in.
3. Look at **network type**: residential is what a normal signup looks like; datacenter or hosting at registration is the classic failure.
4. Check **Proxy / VPN / Tor** and **blacklist** cards — any detection here should be resolved before signup, not after.
5. Plan for **one stable IP** for the account: same connection for signup, login, and everyday use.
6. If the whole office or dorm shares one IP, check its **abuse history** — someone else's behavior may already be attached to your address.

## ### FAQ

**Why can't I create a Claude account? The signup just fails.**
Failed signups with no clear reason are very often an IP decision: datacenter network type, an anonymizer exit, an unsupported IP location, or an address with abuse history. Run the check above and compare — if several signals are flagged, register from a clean residential connection in a supported country instead.

**Does Claude block VPNs?**
Claude doesn't need to block "VPNs" as a category — it scores the exit. A VPN exit that reads as datacenter, sits in the wrong country, or is shared with flagged users will struggle at signup. A VPN also can't fix a region problem: if you're in an unsupported country, appearing elsewhere is itself the red flag.

**My organization was disabled. Was it my IP?**
Not always — content and usage violations exist too. But IP-driven triggers are a common cause: location mismatch against the supported-countries list, anonymizer use, or a shared address with abuse history. Checking your current IP's signals tells you whether the network side is a plausible culprit before you appeal or start over.

**Can I use Claude on my office or campus network?**
You can, but shared networks share reputation. If colleagues or other tenants triggered abuse systems from the same public IP, your signup may inherit it. The blacklist and abuse sections of the check above show what that shared address carries.

## Internal links

- → **Why ChatGPT and Claude block your IP** (\`/blog/why-chatgpt-claude-blocking-your-ip\`) — anchor: "why ChatGPT and Claude block your IP"
- → **What is an IP risk score?** (\`/blog/what-is-ip-risk-score\`) — anchor: "how the Risk Score works"
- → **Why is my IP blacklisted?** (\`/blog/why-is-my-ip-blacklisted\`) — anchor: "check if your IP is blacklisted"
- → **Homepage check** (\`/\`) — anchor: "check another IP"

## How this page differs from the blog post

The blog post *Why ChatGPT and Claude Block Your IP* explains how platform risk systems weigh network signals in general. This landing page is Claude-specific and action-first: it leads with the checker, frames everything around the signup gate and the supported-region rule, and gives a pre-registration checklist — then links to the blog for the underlying principles instead of repeating them.

---

# ZH — 全套文案

## URL 与 meta

- **建议 URL：** \`/claude-ip-check\`（与 EN 共用同一 URL，页面内切换语言，与站内现行双语文章的做法一致）
- **Title：** Claude 注册不了？先免费检测你的 IP 风险 — IP Ready
- **Meta description：** Claude 注册失败、账号刚建好就受限、组织被禁用？Anthropic 在注册环节就查 IP，而你的 IP 是它第一眼看到的东西。免费检测 12 个网络信号——网络类型、代理/VPN 识别、黑名单状态——注册之前先查。

## Hero

- **H1：** 在 Claude 查你的 IP 之前，先自己查一遍
- **副文案：** Claude 的 IP 审查在门口就发生：很多账号在注册或第一次登录时就被拦下，一句话都还没聊。先把同样的网络信号看清楚——免费，不用注册（至少查这一步不用）。
- **检测器：** [此处嵌站内同款检测卡，与首页同一组件：访客 IP、Risk Score、信号卡，以及平台 readiness 列表，其中 Claude 一项高亮。]
- **卡片下方 CTA：** 注册之前先跑一遍——IP 被标记之后再补救，比注册前检查难得多。

## 为什么 Claude 会拦你的 IP

### 1. 关卡在注册环节，不在事后
不少平台是先放进来、慢慢再评判；Claude 把审查前置了。注册和第一次登录，正是机房 IP、匿名代理出口、低信誉地址被拦下的地方。而且很多用户根本看不到任何提到 IP 的报错——只有注册怎么都完不成，或者账号刚建好就带着限制，后来以「组织已被禁用」这类提示出现。

### 2. 不支持的地区是硬拦截
Claude 只在官方名单内的国家和地区提供服务。IP 解析到不支持的地区，注册直接被挡；而人住在名单外、却用名单内国家的出口去访问，账号本身也会有风险——因为这种「对不上」正是地点检测要找的东西。

### 3. 机房与 VPN 出口在注册时被重点盯防
「托管机房段的 IP + 全新注册的账号」是风险组合里最靠前的一种。VPN 出口在注册环节遇到的是同一个问题：成千上万的陌生人共用一个出口，它的信誉等于其中最差的那批人——而 Claude 的注册流程恰恰是最看重这份信誉的地方。

### 4. 共享 IP 的滥用历史
宿舍、办公室、共享办公空间、运营商级 NAT(CGNAT）池，都会把很多用户塞到一个地址后面。如果这个地址上的其他人滥用过账号或跑过自动化，新注册的账号就可能继承这份嫌疑——机制和 MaxMind 的共享 IP 问题一样：平台看到的是地址的历史，不是你的意图。

### 5. 账号生命周期里的 IP 漂移
在一个国家注册、下周从另一个国家登录、中间还轮换着 VPN 节点——这种模式在风控眼里像账号交易或被盗。Claude 账号最稳的状态，是长期固定在一个地点不变的住宅连接上。

## 自查清单

1. 在**创建账号之前**先跑一遍上方检测——对 Claude 来说，顺序很重要。
2. 确认 **IP 所在地是 Claude 官方支持的国家**，而且就是你实际所在的国家。
3. 看**网络类型**：住宅连接是正常注册该有的样子；注册时顶着 datacenter 或 hosting，是最经典的失败姿势。
4. 查 **Proxy / VPN / Tor** 和**黑名单**两组信号——有任何检出，都应该在注册前解决，而不是注册后。
5. 给这个账号规划**一个稳定的 IP**：注册、登录、日常使用，尽量同一条连接。
6. 如果整个办公室或宿舍共用一个 IP，查一下它的**滥用历史**——别人的行为可能已经挂在你的地址上了。

## ### 常见问题

**为什么我注册不了 Claude 账号？注册流程直接失败。**
没有明确理由的注册失败，很多时候就是 IP 层面的决定：机房网络类型、匿名代理出口、不支持的 IP 地区，或者带滥用历史的地址。跑一遍上面的检测对照一下——如果多项信号被标记，换一条干净的支持地区住宅连接再注册。

**Claude 会封 VPN 吗？**
Claude 不需要专门封「VPN」这个品类——它给出口打分。出口被识别为机房、落在错误的国家、或者和被标记用户共用，注册这一关就很难过。VPN 也解决不了地区问题：人如果在不支持的国家，让自己「看起来在别处」本身就是红旗。

**我的组织被禁用了，是 IP 的原因吗？**
不一定——内容和用途违规也存在。但 IP 触发是很常见的一类：地区与支持国家名单对不上、使用了匿名代理、或者共享地址带滥用历史。查一遍你当前 IP 的信号，就能判断网络侧是不是可能的元凶，再决定申诉还是重来。

**我可以在公司或校园网络上用 Claude 吗？**
可以，但共享网络共享信誉。如果同事或其他租户从同一个公网 IP 触发过滥用系统，你的注册可能会被牵连。上面检测里的黑名单与滥用部分，能看到这个共享地址背着什么历史。

## 内链建议

- → **Why ChatGPT and Claude Block Your IP**(\`/blog/why-chatgpt-claude-blocking-your-ip\`)——锚文本：「为什么 ChatGPT 和 Claude 会封你的 IP」
- → **What Is an IP Risk Score**(\`/blog/what-is-ip-risk-score\`)——锚文本：「Risk Score 是怎么算的」
- → **Why Is My IP Blacklisted**(\`/blog/why-is-my-ip-blacklisted\`)——锚文本：「查一下你的 IP 是否进了黑名单」
- → **首页检测**（\`/\`）——锚文本：「检测另一个 IP」

## 本页与博客文的区别

博客文《Why ChatGPT and Claude Block Your IP》讲的是各平台风控权衡网络信号的通用原理。这一页是 Claude 专属、行动优先：开头就是检测器，全部内容围绕「注册关卡」和「支持地区」这两条 Claude 特有的规则展开，配一份注册前清单，原理部分链回博客，不重复展开。

---

## 待 Koray 确认

1. **URL 命名**：用了 \`/claude-ip-check\`，与 ChatGPT 页的 \`/chatgpt-ip-check\` 成对、好记。备选 \`/claude-signup-ip-check\` 更贴「注册」意图，但太长且把页面锁死在注册场景——样稿选了前者，正文里用标题和 meta 把注册意图吃住。
2. **目标词取舍**：EN 没有主攻 \`claude unblocked\`、\`claude vpn bypass\` 这类词。Claude 的地区限制是官方明示的规则，页面立场写成了「地区不对就别硬来」，这既是实话，也和 ChatGPT 页（问题多在信号层）拉开差异；如果 Koray 想接这批流量，需要另定口径，样稿不擅自承诺。
3. **Hero 副文案的玩笑**：「不用注册（至少查这一步不用）」这个括号梗和 Claude 注册难的痛点呼应，但语气比站内其他页面轻。留不留由 Koray 定，删掉括号不影响其余文案。
`,F=`# Landing Page Draft — Amazon IP Check (样稿，未发布）

平台：Amazon
主目标词（EN): amazon account suspended ip / amazon ip address multiple accounts
主目标词（ZH): 亚马逊账号关联 IP / 亚马逊多账号 IP

---

# EN — Full page copy

## URL & meta

- **Suggested URL:** \`/amazon-ip-check\`
- **Title:** Amazon Account Linked or Suspended? Check Your IP Risk First — IP Ready
- **Meta description:** Amazon seller account suspended, linked to a store you don't own, or stuck in registration review? Your IP is one of the signals Amazon correlates across accounts. Check its 12 network signals free — network type, shared-IP history, blacklist status — before you register or log in.

## Hero

- **H1:** Is Your IP Putting Your Amazon Store at Risk?
- **Sub:** On Amazon, an IP is never just yours: it can connect stores, registrations, and logins into one picture. Check what your connection looks like before Amazon's systems do — free, no signup.
- **Detector:** [The site's standard check card is embedded here, same component as the homepage: visitor IP, Risk Score, signal cards, and the platform readiness list with Amazon highlighted.]
- **CTA under the card:** Check the IP before you register a store or log in to one ↑

## Why Amazon flags your IP

### 1. Account linkage is Amazon's signature enforcement
Amazon's best-known seller rule is that one person or business generally runs one seller account — and accounts found to be "related" to a suspended store tend to be suspended together. Amazon never publishes its full correlation method, but the signals systems can correlate are the obvious ones: payment instruments, tax and address details, devices — and the network. If your IP has served another store, especially a suspended one, that overlap is visible in the picture Amazon builds.

### 2. The "clean" IP you bought may have a past
Cross-border sellers are sold datacenter and static IPs as account infrastructure. Those addresses are recycled: the "dedicated" IP you received this month may have carried someone else's store last quarter — possibly a suspended one. An address with abuse or blacklist history doesn't become clean just because it was resold to you.

### 3. Registration and review start with the network
New seller accounts go through identity, tax, and sometimes video verification. A registration that arrives from a hosting range or a shared commercial exit starts that process under suspicion: hosting IPs are what automation and account farms use, so extra checks and slower reviews cluster there, while an ordinary residential connection looks like what it is — a business registering from its own premises.

### 4. Shared working networks connect strangers' stores
Offices, warehouses, coworking spaces, and agencies put many stores behind one public IP. If your operations partner logs into several clients' seller accounts from the same connection — or a neighbouring business on your network gets suspended — the shared address is the thread that ties those accounts together. This is how sellers get "linked" to stores they have never heard of.

### 5. Buyer accounts get caught by the same signals
It's not only sellers. Buyer accounts on flagged shared exits see cancelled orders, locked accounts, and payment reviews, because high-volume abuse also runs through those addresses. If your household or office IP is a recycled VPN or datacenter exit, ordinary shopping can inherit an extraordinary reputation.

## Self-check checklist

1. Run the check above on the exact connection you use for Seller Central — not your phone, not a different network.
2. Look at **network type**: a store registered and run from a residential or normal business connection matches Amazon's picture of a real operation; datacenter is the account-farm profile.
3. Check the **blacklist and abuse history** of any IP you were sold or assigned. Recycled addresses carry recycled reputations.
4. Count **who else uses this connection**: colleagues, an agency, other tenants. Every store touched from this IP is part of the same network picture.
5. Keep **one stable IP per store** over time. Rotating addresses across countries reads as several operators, not one business.
6. **Before registering a new store**, run the check on the connection you'll register from — the registration environment is part of the account's permanent record.

## ### FAQ

**Can Amazon link two seller accounts just because they share an IP?**
Amazon doesn't publish its method, and IP alone is one signal among several — payment, tax, address, and device overlaps matter too. But a shared IP is a real, visible overlap, and sellers are routinely surprised by linkage after sharing networks with other stores. Checking what your IP looks like — and who else is behind it — is the part of the picture you can actually inspect.

**My account was suspended for being "related" to another store. Was it the IP?**
Possibly, but not provably from outside: related-account suspensions also come from shared payment instruments, addresses, or business details. The network is worth ruling in or out — if your store ever shared an IP with other sellers (an agency, an office, a bought "clean" IP), that's a plausible thread, and the check above shows the signals that address currently carries.

**Is a datacenter or static IP safer for running my store?**
Not automatically. Static helps with stability, but a datacenter address still reads as hosting infrastructure — the profile of automation, not of a business premises. What matters is the combination: network type, the address's history, and whether other stores have used it. Run the check on the exact IP before you commit a store to it.

**What Risk Score should my store's IP have?**
There's no official cutoff — Amazon doesn't publish one. Stores run for years on ordinary connections whose IPs score in the low range with no anonymizer detection and no blacklist history. Mid-to-high scores, datacenter type, or a past on the address are where linkage and review risk concentrate.

## Internal links

- → **Residential vs datacenter vs mobile IP** (\`/blog/residential-vs-datacenter-vs-mobile-ip\`) — anchor: "residential vs datacenter IP for seller accounts"
- → **Why is my IP blacklisted?** (\`/blog/why-is-my-ip-blacklisted\`) — anchor: "check if your IP is blacklisted"
- → **What is an IP risk score?** (\`/blog/what-is-ip-risk-score\`) — anchor: "how the Risk Score works"
- → **Homepage check** (\`/\`) — anchor: "check another IP"

## How this page differs from the blog content

The linked blog posts explain the building blocks — how blacklist history attaches to an address, how network types differ, how the Risk Score is composed. This landing page is the Amazon-specific tool page: it leads with the working checker, frames everything around linkage, registration review, and shared working networks, and gives sellers a pre-registration checklist instead of repeating the general principles.

---

# ZH — 全套文案

## URL 与 meta

- **建议 URL：** \`/amazon-ip-check\`（与 EN 共用同一 URL，页面内切换语言，与站内现行双语文章的做法一致）
- **Title：** 亚马逊账号被关联或停用？先免费检测你的 IP 风险 — IP Ready
- **Meta description：** 亚马逊卖家账号被停用、被关联到不认识的店铺，或者卡在注册审核？IP 是亚马逊跨账号比对的信号之一。免费检测它的 12 个网络信号——网络类型、共享 IP 历史、黑名单状态——注册或登录之前先查。

## Hero

- **H1：** 你的 IP 正在给亚马逊店铺埋雷吗？
- **副文案：** 在亚马逊，一个 IP 从来不只属于你一个人：它能把店铺、注册和登录串成一张图。先看清你的连接长什么样，再让亚马逊的系统看——免费，不用注册。
- **检测器：** [此处嵌站内同款检测卡，与首页同一组件：访客 IP、Risk Score、信号卡，以及平台 readiness 列表，其中 Amazon 一项高亮。]
- **卡片下方 CTA：** 注册店铺或登录之前，先把 IP 查一遍 ↑

## 为什么 Amazon 会盯上你的 IP

### 1. 账号关联是亚马逊最有名的执法方式
亚马逊最广为人知的卖家规则，是一个人或一家企业通常只能运营一个卖家账号——被判定与已停用店铺「关联」的账号，往往会被一起停用。亚马逊从未公开完整的关联判定方法，但系统能比对的信号就是那些显而易见的：支付工具、税务与地址信息、设备——以及网络。如果你的 IP 服务过另一个店铺，尤其是一个已经被停用的店铺，这层重叠就在亚马逊拼出的图里。

### 2. 你买来的「干净」IP 可能有前科
跨境卖家会被推荐购买机房 IP 和静态 IP 作为账号基础设施。这类地址是循环使用的：你这个月拿到的「独享」IP，上个季度可能挂着别人的店铺——甚至是一个被停用的店铺。带滥用或黑名单历史的地址，不会因为转手卖给你就变干净。

### 3. 注册与审核从网络环境开始看
新卖家账号要过身份、税务，有时还有视频验证。如果注册请求来自机房段或共享的商业出口，这套流程从一开始就是在怀疑中进行的：托管 IP 正是自动化和账号农场用的东西，额外的核查和更慢的审核都集中在那里；而一条普通的住宅连接，看起来就是它本来的样子——一家企业在自己的场所注册。

### 4. 共享的办公网络会把陌生人的店铺串起来
办公室、仓库、共享办公空间、代运营公司，都会把很多店铺塞到同一个公网 IP 后面。如果你的代运营从同一条连接登录多个客户的卖家账号，或者和你共用网络的另一家商户被停用了，这个共享地址就是把这些账号系在一起的那根线。很多卖家就是这样被「关联」到了素未谋面的店铺。

### 5. 买家号也会被同样的信号误伤
不只是卖家。在被标记的共享出口上，买家号会遇到订单被取消、账号被锁定、支付被审核，因为大批量的滥用也从这类地址发出。如果你的家庭或公司 IP 是回收来的 VPN 或机房出口，正常购物也会继承一份不正常的信誉。

## 自查清单

1. 在你实际登录 Seller Central 的那条连接上跑一遍上方检测——不是手机，不是另一条网络。
2. 看**网络类型**：从住宅或普通商用连接注册和运营的店铺，符合亚马逊眼里真实经营的样子；datacenter 是账号农场的画像。
3. 查任何买来或分配给你的 IP 的**黑名单与滥用历史**。回收的地址，带着回收的信誉。
4. 数一数**还有谁在用这条连接**：同事、代运营、同楼的其他租户。从这个 IP 碰过的每一个店铺，都在同一张网络图里。
5. **一个店铺长期固定一个 IP**。地址在不同国家之间轮换，看起来像多个运营者，而不是一家企业。
6. **注册新店之前**，先在你打算用来注册的连接上跑一遍检测——注册环境是账号永久记录的一部分。

## ### 常见问题

**两个卖家账号只因为共用 IP 就会被关联吗？**
亚马逊不公开判定方法，IP 本身也只是诸多信号之一——支付、税务、地址、设备的重叠同样重要。但共用 IP 是真实、可见的重叠，卖家因为和别的店铺共用网络而被关联的情况并不少见。你的 IP 长什么样、背后还有谁，是这张图里你真正能查清的部分。

**我的账号因「关联」另一个店铺被停用，是 IP 的原因吗？**
有这个可能，但从外部无法证实：关联停用也可能来自共用的支付工具、地址或企业信息。网络这一环值得排查——如果你的店铺曾经和别的卖家共用过 IP（代运营、办公室、买来的「干净」IP），这就是一条成立的线索，上面的检测能看到这个地址现在背着哪些信号。

**用机房 IP 或静态 IP 运营店铺更安全吗？**
不一定。静态能解决稳定性，但机房地址读起来仍然是托管基础设施——自动化的画像，不是经营场所的样子。重要的是组合：网络类型、地址的历史、以及有没有别的店铺用过它。把店铺绑到某个 IP 之前，先拿它跑一遍检测。

**店铺用的 IP，Risk Score 多少合适？**
没有官方分数线——亚马逊没有公布过。用普通连接运营多年的店铺，其 IP 通常分数在低区间、没有匿名代理检出、没有黑名单记录。分数中高、datacenter 类型、或地址带前科，才是关联和审核风险集中的地方。

## 内链建议

- → **Residential vs Datacenter vs Mobile IP**(\`/blog/residential-vs-datacenter-vs-mobile-ip\`)——锚文本：「卖家账号该用住宅 IP 还是机房 IP」
- → **Why Is My IP Blacklisted**(\`/blog/why-is-my-ip-blacklisted\`)——锚文本：「查一下你的 IP 是否进了黑名单」
- → **What Is an IP Risk Score**(\`/blog/what-is-ip-risk-score\`)——锚文本：「Risk Score 是怎么算的」
- → **首页检测**（\`/\`）——锚文本：「检测另一个 IP」

## 本页与博客文的区别

内链里的几篇博客讲的是组成部分——黑名单历史如何附着在一个地址上、不同网络类型的区别、Risk Score 如何构成。这一页是亚马逊专属的工具页：开头就是能用的检测器，全部内容围绕关联、注册审核和共享办公网络展开，给卖家一份注册前清单，通用原理链回博客，不重复展开。

---

## 待 Koray 确认

1. **URL 命名**：用了 \`/amazon-ip-check\`（与前几页成对、好记，也同时接住买家号意图）。备选 \`/amazon-seller-ip-check\` 更精准锁定卖家，但把买家号流量和「关联」长尾挡在门外——样稿选前者，正文和 meta 以卖家为主、买家为辅。
2. **「防关联」这个词的取舍**：ZH 卖家圈实际搜索量最大的说法之一是「防关联」，但它天然带规避工具的意味，样稿只把它当问题现象写（关联怎么发生、怎么自查环境），不把「防关联」当作页面能提供的承诺来卖。如果 Koray 想正面接这个词的流量，需要单独定口径，样稿不擅自承诺「用了就不关联」。
3. **关联机制的表述强度**：全页口径是「IP 是关联信号之一、不是唯一原因」，FAQ 里也明说无法从外部证实个案。这是事实层面的保险：如果 Koray 想要更 IP 中心的强表述（比如暗示查 IP 就能定位关联原因），会越过可核实范围，样稿没有那样写，上线前请确认维持现口径。
`,I=`# Landing Page Draft — eBay IP Check (样稿，未发布）

平台：eBay
主目标词（EN): ebay account restricted ip / ebay stealth account ip
主目标词（ZH): eBay账号受限 IP / eBay注册环境

---

# EN — Full page copy

## URL & meta

- **Suggested URL:** \`/ebay-ip-check\`
- **Title:** eBay Account Restricted? Check Your IP and Sign-Up Environment — IP Ready
- **Meta description:** New eBay account restricted after your first listings, or selling limits that won't lift? Your sign-up environment is part of what eBay scores. Check your IP's 12 network signals free — network type, proxy detection, blacklist history — before you register or list.

## Hero

- **H1:** Was It Your IP That Got Your eBay Account Restricted?
- **Sub:** eBay judges new accounts by the environment they were born in. See what your connection looks like — network type, shared-exit history, location consistency — free, no signup. This page helps you check your environment; it doesn't teach workarounds for eBay's rules.
- **Detector:** [The site's standard check card is embedded here, same component as the homepage: visitor IP, Risk Score, signal cards, and the platform readiness list with eBay highlighted.]
- **CTA under the card:** Check the environment your account lives in ↑

## Why eBay flags your IP

### 1. New accounts are scored by their birth environment
A fresh account's first days carry the most scrutiny. Registering and listing from a datacenter range or a crowded commercial exit matches the profile of disposable accounts, so restrictions, identity checks, and minimal selling limits cluster there. The same person registering from a stable home connection presents a completely different picture.

### 2. Recycled IPs carry previous sellers' histories
Addresses are reused, and so are their reputations. If the last seller on your IP ran policy violations or abandoned a restricted account, the address keeps that record. Consumer ISPs, mobile carriers, and budget VPNs all hand you addresses with strangers' pasts attached.

### 3. Login geography that doesn't match the account
Cross-border sellers register on one eBay site and work across several. But an account created in one country, logging in from another, with a device timezone and language pointing at a third, is the pattern of a traded or hijacked account. Travelling sellers hit the same checks legitimately — the signals can't tell the difference, so consistency is what protects you.

### 4. VPN and proxy exits stack two problems
A VPN exit is both a shared address (its reputation set by the worst of thousands of users) and a location claim that often contradicts the account's registered country. Toggling exits between sessions adds a third problem: an account that teleports. For an established account this means extra verification; for a new one it can mean an early restriction.

### 5. Overlapping with a restricted account connects the new one
eBay publicly allows more than one account — what it prohibits is using additional accounts to get around a restriction or suspension. The overlap that connects accounts is exactly the shared infrastructure: same IP, same device, same details. A new account opened on the same connection as a restricted one doesn't look new to the system at all.

## Self-check checklist

1. Run the check above on the connection your eBay account was registered from — and the one you list from, if they differ.
2. Check **network type**: new selling accounts fare best on residential connections; datacenter at registration is the classic early-restriction profile.
3. Check **Proxy / VPN / Tor** detection. If the platform can see an anonymizer, assume eBay can too.
4. Compare **IP country, device timezone, and your account's registered country**. Two out of three disagreeing is a fixable problem.
5. Keep a **stable IP for a new account's first weeks** — no exit-hopping while limits and trust are being established.
6. Check the **blacklist and abuse history** of a shared home or office IP before registering; a housemate's or colleague's past can be attached to your address.

## ### FAQ

**Why was my new eBay account restricted right after I started listing?**
Early restrictions usually come from the environment, not the listings: a datacenter or shared-exit IP, an address with abuse history, or registration details and network location that don't line up. Run the check above — if several signals are flagged, that's the environment eBay scored. The fix is resolving the restriction through eBay's verification, on an account whose environment no longer trips the same signals.

**Does eBay allow multiple accounts? Does a shared IP get them linked?**
eBay's own policy allows multiple accounts, and many legitimate sellers run several. What's prohibited is opening accounts to evade a restriction. Shared infrastructure — the same IP especially — is how accounts get associated, so two accounts on one household or office IP is normal, but a fresh account on the same connection as a restricted one will be read as the same operation.

**Can I use eBay while travelling or living between countries?**
Yes, but keep the story consistent: sudden country changes in logins trigger verification, and selling from a country that doesn't match your registration invites questions. A stable connection in your registered country for account-sensitive actions (listing, payout changes) and patience with verification prompts is the workable pattern — not exit-hopping to appear at home.

**My account is restricted. Will a clean IP get me selling again?**
No — and be careful here. A restriction attaches to the account, and opening a new account to dodge it violates eBay's policy and usually fails, because the new environment gets connected to the old one. The legitimate path is eBay's appeal and verification process. Where an IP check does help: making sure your genuine account's everyday environment isn't adding avoidable risk on top.

## Internal links

- → **Why is my IP blacklisted?** (\`/blog/why-is-my-ip-blacklisted\`) — anchor: "check if your IP is blacklisted"
- → **Residential vs datacenter vs mobile IP** (\`/blog/residential-vs-datacenter-vs-mobile-ip\`) — anchor: "which IP type looks normal for a new account"
- → **What is an IP risk score?** (\`/blog/what-is-ip-risk-score\`) — anchor: "how the Risk Score works"
- → **Homepage check** (\`/\`) — anchor: "check another IP"

## How this page differs from the blog content

The linked blog posts explain the general mechanics — blacklist history, network types, score composition. This landing page is the eBay-specific tool page: it leads with the checker, frames risk around the sign-up environment and early-account period, and takes the policy-honest line that restrictions are appealed, not evaded — then links out for the underlying principles.

---

# ZH — 全套文案

## URL 与 meta

- **建议 URL：** \`/ebay-ip-check\`（与 EN 共用同一 URL，页面内切换语言，与站内现行双语文章的做法一致）
- **Title：** eBay 账号受限？免费检测你的 IP 与注册环境 — IP Ready
- **Meta description：** eBay 新号刚上架就被受限、销售限额迟迟不涨？注册环境本身就是 eBay 评分的一部分。免费检测你 IP 的 12 个网络信号——网络类型、代理识别、黑名单历史——注册或上架之前先查。本页只做环境自查，不教绕过平台规则的方法。

## Hero

- **H1：** 你的 eBay 账号受限，是 IP 环境的问题吗？
- **副文案：** eBay 对新账号的判断，很大一部分来自它「出生」的环境。先看清你的连接是什么样——网络类型、共享出口历史、登录地是否一致——免费，不用注册。
- **检测器：** [此处嵌站内同款检测卡，与首页同一组件：访客 IP、Risk Score、信号卡，以及平台 readiness 列表，其中 eBay 一项高亮。]
- **卡片下方 CTA：** 查一查你的账号活在什么样的环境里 ↑

## 为什么 eBay 会盯上你的 IP

### 1. 新账号按「出生环境」打分
新账号最初的日子审查最重。从机房段或拥挤的商业出口注册并上架，符合一次性账号的画像，受限、身份核查、最低限额都集中在那里。同一个人换一条稳定的家庭连接注册，呈现出的就是完全不同的图景。

### 2. 回收的 IP 带着前任卖家的历史
地址被重复使用，信誉也一样。如果你的 IP 上一个卖家跑过违规操作、或者弃用了一个受限账号，这个地址会留着那份记录。普通 ISP、移动运营商和廉价 VPN 分给你的，都是带着陌生人过去的地址。

### 3. 登录地和账号对不上
跨境卖家在一个 eBay 站点注册、在好几个站点经营，这很正常。但一个账号在一个国家注册、从另一个国家登录，设备时区和语言又指向第三个地方——这是账号交易或被盗的模式。经常出差的卖家会正当地撞上同样的核查；信号分不出来，所以能保护你的是「一致」。

### 4. VPN 和代理出口是双重问题
VPN 出口既是共享地址（信誉由成千上万人里最差的那批决定），又是一个经常和账号注册国矛盾的地点主张。会话之间切换出口还会加上第三个问题：一个瞬移的账号。对老账号这意味着额外验证；对新账号，可能意味着很早就来的一次受限。

### 5. 与受限账号重叠，新账号就被连上
eBay 公开允许一个人拥有多个账号——它禁止的是用额外账号绕开受限或停用。把账号连起来的正是共享基础设施：同一个 IP、同一台设备、同一套资料。在与受限账号相同的连接上开的新账号，在系统眼里根本算不上「新」。

## 自查清单

1. 在你注册 eBay 账号的那条连接上跑一遍上方检测——如果上架用的是另一条，也各查一遍。
2. 看**网络类型**：新卖家账号在住宅连接上最稳；注册时是 datacenter，是最经典的早期受限画像。
3. 查 **Proxy / VPN / Tor** 检出。如果这个检测能看到匿名代理，就假定 eBay 同样能看到。
4. 把 **IP 所在国家、设备时区、账号注册国**三者对一下。三个里有两个对不上，是可以修的问题。
5. **新账号头几周固定一个 IP**——在限额和信任建立期间，不要换来换去。
6. 注册前查一下共享的家庭或公司 IP 的**黑名单与滥用历史**；室友或同事的过去，可能已经挂在你的地址上了。

## ### 常见问题

**为什么我的 eBay 新号一上架就被受限？**
早期受限通常来自环境，而不是商品本身：机房或共享出口的 IP、带滥用历史的地址、或者注册资料与网络所在地对不上。跑一遍上面的检测——如果多项信号被标记，那就是 eBay 当时评分的环境。解决办法是先在一条不再触发同样信号的连接上，通过 eBay 的核查流程把受限处理掉。

**eBay 允许多个账号吗？共用 IP 会把它们关联吗？**
eBay 自己的政策允许多个账号，很多正经卖家也确实开好几个。被禁止的是开新号绕开受限。账号之间的关联靠的正是共享基础设施——尤其是同一个 IP。所以同一家庭或公司 IP 上有两个账号很正常，但在一个受限账号用过的连接上开新号，会被读成同一个经营主体。

**我经常出差、或者住在两个国家，能正常用 eBay 吗？**
可以，但要让「故事」保持一致：登录国家突变会触发验证，从与注册国不一致的国家卖货会招来询问。可行的做法是：账号敏感操作（上架、改收款）用注册国的一条稳定连接，遇到验证提示耐心过——而不是靠换出口假装自己在家。

**我的账号已经被受限，换一个干净 IP 能重新卖货吗？**
不能——这里要特别小心。受限是跟着账号走的，开新号绕开它违反 eBay 的政策，而且通常会失败，因为新环境会被和老账号连起来。正当路径是走 eBay 的申诉与核查流程。IP 检测真正帮得上忙的地方，是确保你正当账号的日常环境没有在风险上加码。

## 内链建议

- → **Why Is My IP Blacklisted**(\`/blog/why-is-my-ip-blacklisted\`)——锚文本：「查一下你的 IP 是否进了黑名单」
- → **Residential vs Datacenter vs Mobile IP**(\`/blog/residential-vs-datacenter-vs-mobile-ip\`)——锚文本：「哪种 IP 类型对新账号最正常」
- → **What Is an IP Risk Score**(\`/blog/what-is-ip-risk-score\`)——锚文本：「Risk Score 是怎么算的」
- → **首页检测**（\`/\`）——锚文本：「检测另一个 IP」

## 本页与博客文的区别

内链里的几篇博客讲的是通用机制——黑名单历史、网络类型、分数构成。这一页是 eBay 专属的工具页：开头就是检测器，全部内容围绕注册环境和新账号的早期阶段展开，并且明确站在政策诚实的一边——受限靠申诉解决，不靠规避——通用原理链回博客，不重复展开。

---

## 待 Koray 确认

1. **URL 命名**：用了 \`/ebay-ip-check\`，与前几页成对。备选 \`/ebay-account-restricted\` 更贴受限人群的搜索原话，但把页面锁死在「出事后」场景，且接不住注册前检查的意图——样稿选前者，用 title 和 meta 吃住「受限」这个词。
2. **「stealth」词的口径**：EN 目标词里包含 \`ebay stealth account ip\`——这批搜索的真实意图是开小号绕开受限。样稿的处理是：接住这批流量，但页面立场明确写成「只做环境自查、不教绕过」，FAQ 第四问直接说换 IP 开新号违反政策、正道是申诉。如果 Koray 不想让品牌和 stealth 这个词出现在同一页，可以把该词从目标里撤下，页面内容不受影响、照常成立。
3. **受限通知代码要不要写**：卖家圈熟知的受限通知代码（如 MC011）样稿没有写，只用了「受限/核查通知」的通用说法，避免对具体代码的含义做未经核实的解读。如果 Koray 想加强卖家圈的「内行感」，可以加一句带代码的表述，但需要先核实代码含义再落笔。
`,L=`# Landing Page Draft — Binance IP Check (样稿，未发布）

平台：Binance
主目标词（EN): binance ip restricted / binance unsupported region ip
主目标词（ZH): 币安 IP 受限 / Binance 地区限制 IP

---

# EN — Full page copy

## URL & meta

- **Suggested URL:** \`/binance-ip-check\`
- **Title:** Binance Says Restricted Location? Check Where Your IP Resolves — IP Ready
- **Meta description:** Binance blocking you with a restricted-location notice, or asking for extra verification after a trip? Availability is decided by your IP's country. Check the 12 network signals behind your connection free — reported location, network type, proxy detection — and confirm what Binance sees. Region limits are compliance rules; this page verifies your IP, it doesn't get around them.

## Hero

- **H1:** Where Does Binance Think Your IP Lives?
- **Sub:** On Binance, your IP's country decides what you're allowed to use — and geolocation is often wrong. Check the location, network type, and history your connection reports, free, no signup. One thing this page won't do: help anyone evade a region restriction. Those are compliance rules, and an account caught faking its location risks its funds.
- **Detector:** [The site's standard check card is embedded here, same component as the homepage: visitor IP, Risk Score, signal cards, and the platform readiness list with Binance highlighted.]
- **CTA under the card:** Confirm your IP's reported country before you log in ↑

## Why Binance flags your IP

### 1. Availability is licensed by region, and your IP is the proof
Crypto platforms operate under per-country licensing and sanctions rules, so parts of Binance — sometimes the whole platform — are unavailable from certain jurisdictions. The working proof of where you are is your IP's geolocation. That makes the IP database's opinion about your address a compliance fact, whether or not it matches your passport or your actual chair.

### 2. Geolocation databases get addresses wrong
IP location data is approximate and sometimes plainly stale: a block of addresses gets sold, re-registered in another country, and the databases lag behind. Carriers also route traffic out through other cities or neighbouring countries. The result is users in supported regions staring at "restricted location" notices, because their address still resolves to somewhere they have never been.

### 3. VPN and datacenter exits report the wrong country by design
A commercial VPN exit *is* another country — that is the product. Logging in through one tells Binance you are somewhere you are not, which for a compliance-gated platform is not a trick but a violation risk: accounts can be frozen over location misrepresentation. Datacenter exits add a second problem, since hosting ranges are where automated abuse concentrates and they draw extra login scrutiny on their own.

### 4. Travel triggers verification, even when everything is legitimate
A login from a new country — new IP, new ASN, new timezone — is indistinguishable from an account takeover at the signal level. Extra device and email verification, and reviews before withdrawals, are the expected response. Travellers who also rotate VPN exits on the trip multiply the anomaly: three countries in a day looks like three different attackers.

### 5. API keys are bound to IPs — and home IPs move
Binance lets you restrict API keys to specific IP addresses, which is good practice and a common outage: most home connections have dynamic IPs, so the address changes, the allowlist no longer matches, and bots and tools stop working with no error pointing at the network. Addresses behind carrier-grade NAT (CGNAT) can shift even more often. Knowing your current egress IP — and how stable it is — is basic API hygiene.

## Self-check checklist

1. Run the check above and read the **reported country** first. That is the jurisdiction Binance's systems will treat you as being in.
2. Compare it with **where you actually are**. A mismatch means routing or database error — or an exit you forgot was on.
3. Check **network type**: a residential connection in your real country is the unremarkable case; a datacenter exit invites both location and abuse scrutiny.
4. Check **Proxy / VPN / Tor** detection. If an anonymizer is visible, Binance sees one too — and sees its country, not yours.
5. **Before travelling**, note your home IP and expect verification on the first login from abroad; keep one consistent connection at your destination instead of hopping exits.
6. **If you use API keys**, check your current egress IP before adding it to an allowlist, and re-check after your ISP reconnects you — a changed address is the first suspect when keys stop working.

## ### FAQ

**Binance says I'm in a restricted location, but I'm not. Why?**
Because the decision is made from your IP's geolocation, not your physical location. Your address may resolve to another country because of a stale location database, your carrier routing traffic abroad, or a VPN/proxy exit still being active. Run the check above: the reported country it shows is the one creating the notice. Fix the routing — a direct connection from your real location — rather than shopping for an exit that "looks" supported.

**I travelled abroad and Binance asked for extra verification. Is my account in trouble?**
Usually not. A new-country login is a standard account-takeover signal, and step-up verification (sometimes with a review before withdrawals) is the normal response. It settles once the new location is established. What makes it worse is appearing in several countries in quick succession via different exits — consistency reads as travel; hopping reads as an attack.

**Why did my API keys suddenly stop working?**
If your keys are IP-restricted — as they should be — the likeliest cause is that your IP changed. Home and mobile connections are usually dynamic, and CGNAT pools rotate addresses without telling you. Check your current IP above and compare it with the allowlist on the key; a mismatch explains the failure, and a stable egress address is the durable fix.

**Can I just use a VPN to reach Binance from a restricted region?**
No — and this page won't help with that. Region restrictions on Binance are legal and compliance requirements, not a technical puzzle. Accessing from a restricted jurisdiction through an exit that misrepresents your location breaches the platform's terms and can end with a frozen account and funds you can't withdraw. The legitimate use of this check is the opposite direction: confirming that your real, supported location is what your IP actually reports.

## Internal links

- → **What is an IP risk score?** (\`/blog/what-is-ip-risk-score\`) — anchor: "how the Risk Score works"
- → **Residential vs datacenter vs mobile IP** (\`/blog/residential-vs-datacenter-vs-mobile-ip\`) — anchor: "why mobile and CGNAT addresses move"
- → **Why is my IP blacklisted?** (\`/blog/why-is-my-ip-blacklisted\`) — anchor: "check if your IP is blacklisted"
- → **Homepage check** (\`/\`) — anchor: "check another IP"

## How this page differs from the blog content

The linked blog posts cover the general building blocks — score composition, network types, blacklist history. This landing page is the Binance-specific tool page: everything is framed around jurisdiction by geolocation, travel verification, and API allowlists, and it states the compliance line up front — verify your own location, never fake one — instead of repeating general IP principles.

---

# ZH — 全套文案

## URL 与 meta

- **建议 URL：** \`/binance-ip-check\`（与 EN 共用同一 URL，页面内切换语言，与站内现行双语文章的做法一致）
- **Title：** 币安提示地区受限？免费检测你的 IP 归属地 — IP Ready
- **Meta description：** Binance 弹出受限地区提示、出差回来被要求额外验证、API 密钥突然失效？可用性由你 IP 的归属国决定。免费检测你连接背后的 12 个网络信号——解析所在地、网络类型、代理检出——先确认 Binance 眼里你在哪。地区限制是合规规则，本页只帮你核对自己的 IP 状态，不提供规避方法。

## Hero

- **H1：** Binance 眼里，你的 IP 在哪个国家？
- **副文案：** 在 Binance，你 IP 的归属国决定你能用什么——而地理定位经常出错。先查清你的连接上报的位置、网络类型和历史，免费，不用注册。先说清一条：本页不帮任何人规避地区限制。那是合规规则，伪装所在地被发现的账号，风险是资金一起冻住。
- **检测器：** [此处嵌站内同款检测卡，与首页同一组件：访客 IP、Risk Score、信号卡，以及平台 readiness 列表，其中 Binance 一项高亮。]
- **卡片下方 CTA：** 登录之前，先确认你 IP 上报的国家 ↑

## 为什么 Binance 会盯上你的 IP

### 1. 可用性按地区发牌照，你的 IP 就是「所在地证明」
加密平台受各国牌照与制裁规则约束，Binance 的一部分功能——有时是整个平台——在某些司法辖区不可用。而「你在哪儿」的实际证明，是你 IP 的地理定位。于是 IP 数据库对你这个地址的看法就成了合规事实，不管它和你的护照、你实际坐的位置是否一致。

### 2. 地理定位数据库会把地址标错
IP 定位数据是近似的，有时干脆是过期的：一段地址被出售、在另一个国家重新注册，数据库跟不上。运营商也会把流量从其他城市、甚至邻国绕出去。结果就是身在支持地区的用户对着「受限地区」提示——因为他的地址还解析到一个他从没去过的地方。

### 3. VPN 和机房出口天生就上报错误的国家
商业 VPN 出口「就是另一个国家」——这正是它的卖点。用它登录等于告诉 Binance 你在一个你并不在的地方；对合规门控的平台来说，这不是小聪明，而是违规风险：账号可能因所在地造假被冻结。机房出口还多一层问题：托管段是自动化滥用的聚集地，本身就会引来额外的登录审查。

### 4. 旅行会触发验证，哪怕一切正当
从一个新国家登录——新 IP、新 ASN、新时区——在信号层面和账号被盗无法区分。额外的设备与邮箱验证、提现前的审核，是预期内的反应。旅途中再轮换 VPN 出口会把异常叠满：一天出现在三个国家，看起来像三个不同的攻击者。

### 5. API 密钥绑 IP，而家庭 IP 会变
Binance 允许把 API 密钥限制到指定 IP，这是好习惯，也是常见的「突然失效」：多数家庭连接是动态 IP，地址一变，白名单对不上，机器人和工具就停工，而且报错不会指向网络。运营商级 NAT(CGNAT）后面的地址变得更频繁。知道你当前的出口 IP、以及它有多稳定，是 API 使用的基本卫生。

## 自查清单

1. 跑一遍上方检测，**先看上报的国家**。那就是 Binance 系统会认定的你所在的司法辖区。
2. 把它和**你实际所在的地方**对一下。对不上，说明是路由或数据库错误——或者有个你忘了关的出口还开着。
3. 看**网络类型**：真实国家的住宅连接是最不起眼的情况；机房出口会同时引来地区和滥用两方面的审查。
4. 查 **Proxy / VPN / Tor** 检出。匿名代理在这里可见，在 Binance 那里同样可见——而且它看到的是出口的国家，不是你的。
5. **出差或旅行之前**，记下你家里的 IP，并预期到达后第一次登录会被验证；在目的地固定用一条连接，不要换来换去。
6. **如果你用 API 密钥**，把当前出口 IP 加进白名单之前先查一遍；ISP 重新拨号之后再查一遍——密钥失效时，地址变了是头号嫌疑。

## ### 常见问题

**Binance 说我在受限地区，但我明明不在，为什么？**
因为判定依据是你 IP 的地理定位，不是你的物理位置。你的地址可能因为定位数据库过期、运营商把流量绕到了国外、或者有个 VPN/代理出口还开着，而解析到另一个国家。跑一遍上面的检测：它显示的上报国家，就是制造这条提示的那个。修法是修路由——从你的真实所在地直连——而不是去找一个「看起来受支持」的出口。

**我出差回来被要求额外验证，账号是不是出问题了？**
通常不是。异地登录是标准的账号被盗信号，追加验证（有时提现前还要过一轮审核）是正常反应；新地点稳定下来就好了。真正让情况变糟的是短时间内通过不同出口出现在好几个国家——固定一个地点读起来是旅行，跳来跳去读起来是攻击。

**我的 API 密钥突然不能用了，为什么？**
如果你的密钥做了 IP 限制——本就应该做——最可能的原因是你的 IP 变了。家庭和移动连接通常是动态地址，CGNAT 地址池更是会不打招呼地轮换。查一下你现在的 IP，和密钥上的白名单对一下；对不上就解释了故障，长久的修法是一条稳定的出口地址。

**我人在受限地区，用 VPN 连 Binance 不就行了？**
不行——本页也不会帮这个忙。Binance 的地区限制是法律与合规要求，不是技术谜题。用伪装所在地的出口从受限辖区访问，违反平台条款，后果可能是账号冻结、资金无法提现。这个检测的正当用途恰恰相反：确认你的真实受支持所在地，和你 IP 实际上报的位置一致。

## 内链建议

- → **What Is an IP Risk Score**(\`/blog/what-is-ip-risk-score\`)——锚文本：「Risk Score 是怎么算的」
- → **Residential vs Datacenter vs Mobile IP**(\`/blog/residential-vs-datacenter-vs-mobile-ip\`)——锚文本：「为什么移动网络和 CGNAT 地址会漂移」
- → **Why Is My IP Blacklisted**(\`/blog/why-is-my-ip-blacklisted\`)——锚文本：「查一下你的 IP 是否进了黑名单」
- → **首页检测**（\`/\`）——锚文本：「检测另一个 IP」

## 本页与博客文的区别

内链里的几篇博客讲的是通用组成部分——分数构成、网络类型、黑名单历史。这一页是 Binance 专属的工具页：全部内容围绕「按地理定位定辖区、出差验证、API 白名单」展开，并且一开头就把合规线划清——核对你自己的所在地，而不是伪造一个——通用原理链回博客，不重复展开。

---

## 待 Koray 确认

1. **URL 命名**：用了 \`/binance-ip-check\`，与前几页成对。备选 \`/binance-region-check\` 更直白地点出「地区」这个核心问题，但丢了 ip-check 系列的一致性，也接不住 API/IP 类长尾——样稿选前者，用 title 和 H1 把「归属地」顶到最前面。
2. **红线表述的位置和强度**：合规立场在样稿里出现了三次——Hero 副文案一句、FAQ 第四问正面回答、meta 里一句。这是五页里口径最硬的一页，因为脱离这个立场，\`binance ip restricted\` 这批流量天然会滑向规避教程。如果 Koray 觉得太硬，可以减到 FAQ 一处；但建议至少保留 FAQ 的正面回答，它是这页和规避类内容之间的分界线。
3. **API 密钥这条线留不留**：第 5 条原因和第 6 步清单、FAQ 第三问都服务于用 API/量化工具的用户——这是 Binance 页相比其他四页独有的专业人群，真实且差异大。但如果 Koray 想让五页保持同一消费级难度，这条线可以整段撤掉，页面靠地区与旅行两条线也成立。样稿按「保留」写的。
`;function R(e,t){return(e.find(e=>t.test(e))??``).replace(t,``).trim()}function z(e,t){return e.findIndex(e=>t.test(e))}function B(e,t,n){return e.slice(t+1,n<0?e.length:n)}function V(e,t,n){let r=[],i=/^###\s+\d+\.\s+(.+?)\s*$/,a=n<0?e.length:n;for(let n=t+1;n<a;n+=1){let t=i.exec(e[n]??``);if(!t)continue;let o=a;for(let t=n+1;t<a;t+=1)if(i.test(e[t]??``)){o=t;break}let s=e.slice(n+1,o).filter(Boolean).join(` `);r.push({title:t[1]??``,body:s})}return r}function H(e,t,n){let r=[];for(let i of B(e,t,n)){let e=/^\d+\.\s+(.+)$/.exec(i.trim());e&&r.push(e[1]??``)}return r}function U(e,t,n){let r=[],i=``,a=[],o=()=>{i&&a.length&&r.push({question:i,answer:a.join(` `)}),i=``,a=[]};for(let r of B(e,t,n)){let e=r.trim(),t=/^\*\*(.+?)\*\*\s*$/.exec(e);t?(o(),i=t[1]??``):e&&i&&a.push(e)}return o(),r}function te(e,t,n){return B(e,t,n).filter(e=>/^-\s/.test(e.trim())).map(e=>{let t=e.match(/\*\*(.+?)\*\*/)?.[1]??``;return{label:t,href:(e.match(/\(\s*([^\)]+)\s*\)/)?.[1]??`/`).replace(RegExp("`",`g`),``).trim(),anchor:(e.split(/anchor:|锚文本[:：]/i)[1]??``).replace(/^[\s"'“「]+|[\s"'”」]+$/g,``).trim()||t}})}function W(e){let t=e.replace(/\r\n?/g,`
`).split(`
`).map(e=>e.trimEnd()),n=z(t,/^##\s+Hero\s*$/),r=z(t,/^##\s+(?:Why|为什么)/),i=z(t,/^##\s+(?:Self-check checklist|自查清单)/),a=z(t,/^##\s+###\s+(?:FAQ|常见问题)/),o=z(t,/^##\s+(?:Internal links|内链建议)/),s=B(t,z(t,/^##\s+URL/),n),c=B(t,n,r);return{title:R(s,/^-\s+\*\*Title[：:]\*\*\s*/),description:R(s,/^-\s+\*\*Meta description[：:]\*\*\s*/),h1:R(c,/^-\s+\*\*H1[：:]\*\*\s*/),sub:R(c,/^-\s+\*\*(?:Sub|副文案)[：:]\*\*\s*/),detectorCta:R(c,/^-\s+\*\*(?:CTA under the card|卡片下方 CTA)[：:]\*\*\s*/),whyTitle:t[r]?.replace(/^##\s+/,``).trim()??``,reasons:V(t,r,i),checklistTitle:t[i]?.replace(/^##\s+/,``).trim()??``,checklist:H(t,i,a),faqTitle:t[a]?.replace(/^##\s+###\s+/,``).trim()??``,faq:U(t,a,o),linksTitle:t[o]?.replace(/^##\s+/,``).trim()??``,links:te(t,o,t.length)}}function G(e){let t=e.replace(/\r\n?/g,`
`),n=t.search(/^#{1,2}\s+ZH\s+—/m),r=n>=0?t.slice(0,n):t,i=n>=0?t.slice(n):t;return{en:W(r),zh:W(i)}}function K(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(RegExp("`([^`]+)`",`g`),`<code>$1</code>`).replace(/\*([^*]+)\*/g,`<em>$1</em>`)}var q={chatgpt:{slug:`chatgpt-ip-check`,platform:`ChatGPT`,icon:`/assets/icons/platform/IP_ic_chatgpt.svg`,copy:G(N)},claude:{slug:`claude-ip-check`,platform:`Claude`,icon:`/assets/icons/platform/IP_ic_claude.svg`,copy:G(P)},amazon:{slug:`amazon-ip-check`,platform:`Amazon`,icon:`/assets/icons/platform/IP_ic_Amazon.svg`,copy:G(F)},ebay:{slug:`ebay-ip-check`,platform:`eBay`,icon:`/assets/icons/platform/IP_ic_eBay.svg`,copy:G(I)},binance:{slug:`binance-ip-check`,platform:`Binance`,icon:`/assets/icons/platform/IP_ic_binance.svg`,copy:G(L)}},J={class:`landing-detector`,"aria-label":`IP signal check`},Y={class:`landing-detector-main`},X={class:`landing-detector-globe`,"aria-hidden":`true`},Z={class:`landing-detector-heading`},Q={class:`landing-detector-overline`},ne={class:`landing-detector-ipline`},re=[`disabled`,`aria-label`,`title`],ie={class:`landing-detector-country`},ae=[`src`],oe={class:`landing-detector-facts`},se={class:`landing-detector-analysis`},ce={class:`landing-detector-analysis-title`},le={key:0,"aria-hidden":`true`},ue={class:`landing-detector-signals`,"aria-label":`Network signal cards`},de={class:`landing-detector-side`},fe={class:`landing-detector-label`},pe={class:`landing-detector-score`},me={class:`landing-detector-label`},he={class:`landing-detector-platforms`},ge={class:`landing-detector-icon`},_e={class:`landing-detector-link`,href:`/#readiness`},ve=Object.assign(w(m({__name:`PlatformLandingDetector`,props:{platform:{}},setup(c){let f=c,{locale:m,t:g}=y(),b=l(null),x=l(!0),C=l(``),w=l(!1),M=u(()=>b.value?.risk_score??0),N=u(()=>ee(M.value)),P=u(()=>g(`risk.`+N.value)),F=u(()=>E(b.value?.connection_type,g)),I=u(()=>b.value?O(b.value,g):null),L=u(()=>{if(!b.value?.country_code)return g(`report.detectingLocation`);try{return new Intl.DisplayNames([m.value===`zh`?`zh-CN`:`en`],{type:`region`}).of(b.value.country_code)||b.value.country_code}catch{return b.value.country_code}}),R=u(()=>{let e=b.value?.country_code?.toUpperCase();return e?.length===2?`/assets/icons/flags/`+e+`.svg`:``}),z=u(()=>({country_code:b.value?.country_code,proxy:b.value?.proxy,vpn:b.value?.vpn,tor:b.value?.tor,anonymous:b.value?.anonymous,icloud_relay:b.value?.icloud_relay,hosting:b.value?.hosting,recent_abuse:b.value?.recent_abuse})),B=u(()=>j.map(e=>({...e,readiness:b.value?A(e.name,z.value):void 0}))),V=u(()=>[{label:`Proxy`,value:b.value?b.value.proxy?`Detected`:`Clear`:`--`,active:!!b.value?.proxy},{label:`VPN`,value:b.value?b.value.vpn?`Detected`:`Clear`:`--`,active:!!b.value?.vpn},{label:`Tor`,value:b.value?b.value.tor?`Detected`:`Clear`:`--`,active:!!b.value?.tor},{label:`Abuse`,value:b.value?b.value.recent_abuse?`Detected`:`Clear`:`--`,active:!!b.value?.recent_abuse}]);async function H(){x.value=!0;try{b.value=await v(`/api/ip-check`,{timeout:3e4,retry:0})}catch(e){let t=e;C.value=t.data?.statusMessage||t.message||g(`misc.scanFailed`)}finally{x.value=!1}}async function U(){!b.value?.ip||!navigator.clipboard||(await navigator.clipboard.writeText(b.value.ip),w.value=!0,window.setTimeout(()=>{w.value=!1},1500))}return a(()=>{H()}),(a,c)=>{let l=T,u=D;return _(),n(`article`,J,[i(`div`,Y,[i(`div`,X,[o(l)]),i(`div`,Z,[i(`p`,Q,t(e(g)(`report.yourIp`)),1),i(`div`,ne,[i(`strong`,null,t(e(b)?.ip||(e(x)?e(g)(`report.detecting`):e(g)(`report.unavailable`))),1),i(`button`,{class:`landing-detector-copy`,type:`button`,disabled:!e(b)?.ip,"aria-label":e(g)(`report.copyIp`),title:e(w)?e(g)(`misc.copied`):e(g)(`report.copyIp`),onClick:U},[...c[0]||=[i(`span`,{"aria-hidden":`true`},`⧉`,-1)]],8,re)]),i(`div`,ie,[e(R)?(_(),n(`img`,{key:0,src:e(R),alt:``},null,8,ae)):d(``,!0),i(`b`,null,t(e(C)||e(L)+(e(b)?.city?` / `+e(b).city:``)),1)])]),i(`div`,oe,[i(`div`,null,[i(`b`,null,t(e(b)?.ISP||e(g)(`report.detecting`)),1),i(`span`,null,t(e(g)(`report.isp`)),1)]),i(`div`,null,[i(`b`,null,t(e(F)),1),i(`span`,null,t(e(g)(`report.networkType`)),1)]),i(`div`,null,[i(`b`,null,t(e(b)?.timezone||e(g)(`misc.unknown`)),1),i(`span`,null,t(e(g)(`report.timezone`)),1)])]),i(`div`,se,[i(`div`,ce,[c[1]||=i(`img`,{src:S,alt:``},null,-1),i(`b`,null,t(e(g)(`report.aiAnalysis`)),1)]),i(`h2`,null,[e(b)?(_(),n(`span`,le,t(e(M)<=30?`👍`:`⚠️`),1)):d(``,!0),p(` `+t(e(I)?.title||e(g)(`report.analyzing`)),1)]),i(`p`,null,t(e(I)?.summary||e(g)(`report.checkingSignals`)),1),i(`p`,null,[i(`b`,null,t(e(g)(`report.mainConcern`)),1),p(t(` `+(e(I)?.concern||e(g)(`report.analysisPending`))),1)]),i(`div`,ue,[(_(!0),n(h,null,r(e(V),e=>(_(),n(`div`,{key:e.label,class:s({active:e.active})},[i(`span`,null,t(e.label),1),i(`b`,null,t(e.value),1)],2))),128))])])]),i(`aside`,de,[i(`p`,fe,t(e(g)(`status.riskScore`)),1),i(`div`,pe,[i(`strong`,null,t(e(b)?e(k)(e(M)):`--`),1),c[2]||=i(`span`,null,`/100`,-1),i(`em`,null,t(e(b)?e(P):e(g)(`report.checkingSignals`)),1)]),c[4]||=i(`div`,{class:`landing-detector-rule`},null,-1),i(`p`,me,t(e(g)(`report.quickRead`)),1),i(`div`,he,[(_(!0),n(h,null,r(e(B),e=>(_(),n(`div`,{key:e.name,class:s([`landing-detector-platform`,{highlighted:e.name===f.platform}])},[i(`span`,null,[i(`span`,ge,[o(u,{name:e.name,src:e.icon},null,8,[`name`,`src`])]),p(t(e.name),1)]),i(`b`,null,t(e.readiness?.score??`--`),1)],2))),128))]),i(`a`,_e,[p(t(e(g)(`report.otherPlatforms`))+` `,1),c[3]||=i(`span`,{"aria-hidden":`true`},`→`,-1)])])])}}}),[[`__scopeId`,`data-v-5981697f`]]),{__name:`PlatformLandingDetector`}),ye={key:1,class:`devtool-reference-header`},be={class:`devtool-reference-actions`},xe={id:`top`},Se={class:`platform-landing-hero`},Ce={key:0,class:`platform-landing-hero-video`,autoplay:``,muted:``,loop:``,playsinline:``,preload:`metadata`,"aria-hidden":`true`},we={class:`platform-landing-hero-inner`},Te={class:`platform-landing-hero-copy`},Ee={class:`platform-landing-kicker`},De=[`src`],Oe={class:`platform-landing-sub`},ke={key:0,class:`platform-landing-hero-status`,"aria-label":`ChatGPT IP check status`},Ae={key:1,class:`platform-landing-command-row`},je={key:2,class:`platform-landing-hero-scroll`},Me={key:3,id:`scan`,class:`platform-landing-detector-wrap`},Ne={key:4,class:`platform-landing-scroll-cta`,href:`#why`},Pe={key:0,id:`scan`,class:`platform-landing-scan-section`},Fe={class:`platform-landing-scan-inner`},Ie={class:`platform-landing-detector-wrap`},Le={id:`why`,class:`platform-landing-section platform-landing-why`},Re={class:`platform-landing-section-inner`},ze={class:`platform-landing-section-index`},Be={class:`platform-landing-section-heading`},Ve={class:`platform-landing-reasons`},He={class:`platform-landing-reason-number`},Ue=[`innerHTML`],We={class:`platform-landing-section platform-landing-checklist`},Ge={class:`platform-landing-section-inner platform-landing-checklist-inner`},Ke={class:`platform-landing-section-index`},qe={class:`platform-landing-checklist-list`},Je=[`innerHTML`],$={id:`faq`,class:`platform-landing-section platform-landing-faq`},Ye={class:`platform-landing-section-inner`},Xe={class:`platform-landing-section-index`},Ze={class:`platform-landing-faq-list`},Qe=[`aria-expanded`,`onClick`],$e={class:`platform-landing-faq-answer`},et={class:`platform-landing-links`},tt={class:`platform-landing-section-inner`},nt={class:`platform-landing-section-index`},rt={class:`platform-landing-links-grid`},it=[`href`],at=Object.assign(w(m({__name:`PlatformLandingPage`,props:{page:{}},setup(a){let m=a,{locale:v,t:w}=y(),T=u(()=>m.page.copy[v.value===`zh`?`zh`:`en`]),E=u(()=>m.page.slug===`chatgpt-ip-check`),D=l(0),O=u(()=>({"@context":`https://schema.org`,"@type":`FAQPage`,mainEntity:T.value.faq.map(e=>({"@type":`Question`,name:e.question,acceptedAnswer:{"@type":`Answer`,text:e.answer}}))}));g(()=>({title:T.value.title,meta:[{name:`description`,content:T.value.description},{property:`og:title`,content:T.value.title},{property:`og:description`,content:T.value.description},{property:`og:type`,content:`website`}],script:[{key:`landing-faq-jsonld`,type:`application/ld+json`,innerHTML:JSON.stringify(O.value)}],link:[{rel:`preconnect`,href:`https://fonts.googleapis.com`},{rel:`preconnect`,href:`https://fonts.gstatic.com`,crossorigin:``},{rel:`stylesheet`,href:`https://fonts.googleapis.com/css2?family=Archivo:wght@500&family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap`}]}));function k(e){D.value=D.value===e?null:e}return(a,l)=>{let u=x,g=b,v=ve,y=C;return _(),n(`div`,{class:s([`platform-landing-page`,{"platform-landing-page--devtool":m.page.slug===`chatgpt-ip-check`}])},[e(E)?(_(),n(`header`,ye,[l[1]||=f(`<a class="devtool-reference-brand" href="#top" aria-label="IP Ready home" data-v-8082a9a4><img src="`+S+`" alt="" data-v-8082a9a4><span data-v-8082a9a4>IP Ready</span></a><nav aria-label="ChatGPT IP check navigation" data-v-8082a9a4><a href="#scan" data-v-8082a9a4>Features</a><a href="#why" data-v-8082a9a4>Directory</a><a href="#faq" data-v-8082a9a4>Changelog</a></nav>`,2),i(`div`,be,[o(g),l[0]||=i(`a`,{href:`#scan`},[p(`Run a check `),i(`span`,{"aria-hidden":`true`},`↗`)],-1)])])):(_(),c(u,{key:0})),i(`main`,xe,[i(`section`,Se,[l[7]||=i(`div`,{class:`platform-landing-hero-wash`,"aria-hidden":`true`},null,-1),e(E)?(_(),n(`video`,Ce,[...l[2]||=[i(`source`,{src:M,type:`video/mp4`},null,-1)]])):d(``,!0),i(`div`,we,[i(`div`,Te,[i(`div`,Ee,[i(`img`,{src:m.page.icon,alt:``},null,8,De),p(t(m.page.platform)+` IP Check`,1)]),i(`h1`,null,t(e(T).h1),1),i(`p`,Oe,t(e(T).sub),1),m.page.slug===`chatgpt-ip-check`?(_(),n(`div`,ke,[...l[3]||=[i(`span`,null,[i(`i`,{"aria-hidden":`true`}),p(` Live network scan`)],-1),i(`span`,null,`12 signals`,-1),i(`span`,null,`No signup`,-1)]])):d(``,!0),e(E)?(_(),n(`div`,Ae,[...l[4]||=[i(`div`,{class:`platform-landing-command`},[i(`span`,null,`$`),i(`code`,null,`ipready check --platform chatgpt`),i(`span`,{class:`platform-landing-command-copy`,"aria-hidden":`true`},`⌘`)],-1),i(`a`,{class:`platform-landing-run-cta`,href:`#scan`},[p(`Run live check `),i(`span`,{"aria-hidden":`true`},`↗`)],-1)]])):d(``,!0),e(E)?(_(),n(`div`,je,[...l[5]||=[i(`span`,null,`Scroll`,-1),i(`span`,{"aria-hidden":`true`},`↓`,-1)]])):d(``,!0),e(E)?d(``,!0):(_(),n(`div`,Me,[o(v,{platform:m.page.platform},null,8,[`platform`])])),e(E)?d(``,!0):(_(),n(`a`,Ne,[p(t(e(T).detectorCta)+` `,1),l[6]||=i(`span`,{"aria-hidden":`true`},`↓`,-1)]))])])]),e(E)?(_(),n(`section`,Pe,[i(`div`,Fe,[l[8]||=i(`p`,{class:`platform-landing-section-index`},[i(`span`,null,`01`),p(`Live network readout`)],-1),l[9]||=i(`div`,{class:`platform-landing-scan-heading`},[i(`h2`,null,`Read the signals before they become a block.`),i(`p`,null,`One quick scan turns the hidden connection context into a practical readiness report.`)],-1),i(`div`,Ie,[o(v,{platform:m.page.platform},null,8,[`platform`])]),l[10]||=i(`div`,{class:`platform-landing-signal-rail`,"aria-label":`Signals in this check`},[i(`span`,null,[i(`b`,null,`01`),p(` IP provenance`)]),i(`span`,null,[i(`b`,null,`02`),p(` Reputation score`)]),i(`span`,null,[i(`b`,null,`03`),p(` ChatGPT readiness`)])],-1)])])):d(``,!0),i(`section`,Le,[i(`div`,Re,[i(`p`,ze,[i(`span`,null,t(e(E)?`02`:`01`),1),p(t(e(E)?`Signal map`:e(T).whyTitle),1)]),i(`div`,Be,[i(`h2`,null,t(e(E)?`See the network context behind every ChatGPT session.`:e(T).whyTitle),1)]),i(`div`,Ve,[(_(!0),n(h,null,r(e(T).reasons,(r,a)=>(_(),n(`article`,{key:r.title,class:`platform-landing-reason`},[i(`span`,He,t(String(a+1).padStart(2,`0`)),1),i(`h3`,null,t(r.title),1),i(`p`,{innerHTML:e(K)(r.body)},null,8,Ue)]))),128))])])]),i(`section`,We,[i(`div`,Ge,[i(`div`,null,[i(`p`,Ke,[i(`span`,null,t(e(E)?`03`:`02`),1),p(t(e(E)?`Runbook`:e(T).checklistTitle),1)]),i(`h2`,null,t(e(E)?`Stabilize the connection before you sign in.`:e(T).checklistTitle),1)]),i(`ol`,qe,[(_(!0),n(h,null,r(e(T).checklist,(r,a)=>(_(),n(`li`,{key:r},[i(`span`,null,t(String(a+1).padStart(2,`0`)),1),i(`p`,{innerHTML:e(K)(r)},null,8,Je)]))),128))])])]),i(`section`,$,[i(`div`,Ye,[i(`p`,Xe,[i(`span`,null,t(e(E)?`04`:`03`),1),p(t(e(E)?`Questions, answered`:e(T).faqTitle),1)]),i(`h2`,null,t(e(E)?`Questions, answered.`:e(T).faqTitle),1),i(`div`,Ze,[(_(!0),n(h,null,r(e(T).faq,(r,a)=>(_(),n(`article`,{key:r.question,class:s([`platform-landing-faq-item`,{active:e(D)===a}])},[i(`button`,{type:`button`,"aria-expanded":e(D)===a,onClick:e=>k(a)},[i(`span`,null,t(r.question),1),l[11]||=i(`span`,{class:`platform-landing-faq-toggle`,"aria-hidden":`true`},`+`,-1)],8,Qe),i(`div`,$e,[i(`p`,null,t(r.answer),1)])],2))),128))])])]),i(`section`,et,[i(`div`,tt,[i(`p`,nt,[i(`span`,null,t(e(E)?`05`:`04`),1),p(t(e(E)?`Keep exploring`:e(T).linksTitle),1)]),i(`div`,rt,[(_(!0),n(h,null,r(e(T).links,e=>(_(),n(`a`,{key:e.href+e.anchor,href:e.href,class:`platform-landing-link`},[i(`span`,null,t(e.anchor),1),l[12]||=i(`span`,{"aria-hidden":`true`},`↗`,-1)],8,it))),128))])])])]),o(y)],2)}}}),[[`__scopeId`,`data-v-8082a9a4`]]),{__name:`PlatformLandingPage`});export{q as n,at as t};