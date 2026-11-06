import { promises } from 'node:fs';
import path from 'node:path';
import { get, put } from '@vercel/blob';
import { r as renderMarkdown } from './markdown.mjs';

const SEED_POSTS = [
  {
    "slug": "best-candidate-outreach-tools-recruiters-2026",
    "title": "Best Candidate Outreach Tools for Recruiters in 2026",
    "date": "August 25, 2026",
    "readTime": "9 min read",
    "author": "Wrangle",
    "category": "resources",
    "cover": "window",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "Comparing the leading candidate outreach and automation platforms on real features and pricing.",
    "status": "published",
    "body": `
      <p>Finding the right candidate outreach and automation platform is one of the highest-leverage decisions a recruiting team can make. The right tool reduces time-to-fill, increases response rates, and lets recruiters focus on conversations rather than coordination. The wrong one creates another siloed system nobody uses. The market in 2026 is crowded with options ranging from legacy CRMs with automation bolted on to purpose-built AI-native platforms. This guide compares the leading platforms on real features and pricing, and lays out why Wrangle is the strongest fit for most modern recruiting teams.</p>
      <hr>
      <h2>What Is Candidate Outreach Automation?</h2>
      <p>Candidate outreach automation refers to software that helps recruiting teams find, contact, and follow up with candidates at scale, without requiring manual effort for every step. This includes:</p>
      <ul>
        <li><strong>Multi-step email sequences</strong> triggered automatically over time</li>
        <li><strong>AI-personalized messaging</strong> generated from candidate profiles and job requirements</li>
        <li><strong>Multi-channel outreach</strong> coordinated across email and LinkedIn</li>
        <li><strong>ATS and CRM integrations</strong> that keep outreach data synced with your existing stack</li>
      </ul>
      <p>The goal is not to remove the recruiter from the process. It is to automate the repetitive parts so recruiters can spend their time on the conversations that actually require human judgment.</p>
      <hr>
      <h2>What to Look for in a Candidate Outreach Tool</h2>
      <table>
        <thead>
          <tr><th>Feature</th><th>Why It Matters</th></tr>
        </thead>
        <tbody>
          <tr><td>AI-personalized outreach</td><td>Generic messages get ignored; personalization at scale drives higher response rates</td></tr>
          <tr><td>Multi-step sequences</td><td>One-off emails have low conversion; automated follow-up cadences are table stakes</td></tr>
          <tr><td>Sourcing and outreach in one system</td><td>Fewer tools, tighter workflows, better data</td></tr>
          <tr><td>ATS integrations</td><td>Outreach data needs to flow into your system of record without manual effort</td></tr>
          <tr><td>Recruiter approval controls</td><td>AI drafts and recommends; humans approve before sending</td></tr>
          <tr><td>Published, transparent pricing</td><td>You should know what you're paying before a sales call, not after</td></tr>
          <tr><td>Disclosed accuracy data</td><td>A tool that claims "AI-powered" should be able to show you a real number behind that claim</td></tr>
        </tbody>
      </table>
      <hr>
      <h2>Wrangle: The Recommended Platform for AI-Native Candidate Outreach</h2>
      <p>Wrangle is an AI-native sourcing and outreach platform built around a talent graph \u2014 a model that maps relationships between people, companies, and skills instead of matching keywords against a flat database. That architecture is what its disclosed benchmark results measure directly: <strong>93.71% Hit@1, 97.64% Hit@10, and 89.29% macro precision</strong> on the Exa People Search Benchmark, and <strong>93.42% overall</strong> on PeopleSearchBench. These are published, sourced numbers \u2014 not a marketing claim about "AI-powered" search without evidence behind it.</p>
      <p><strong>AI-Personalized Outreach, Included at Every Tier</strong></p>
      <p>Wrangle generates outreach messages using AI variables that pull from a candidate's actual profile and the specific role, rather than basic mail-merge tokens. Recruiters review before anything sends. This is included in Wrangle's Starter plan \u2014 no add-on required.</p>
      <p><strong>Multi-Channel Sequences: Email and LinkedIn</strong></p>
      <p>Wrangle runs coordinated outreach across email sequences (every plan) and native LinkedIn Connect/DM/InMail steps (Scale plan and above). Sequencing logic, follow-up timing, and AI-personalized messaging are part of the core workflow, not bolted-on integrations.</p>
      <p><strong>Published Pricing, No Sales Call Required</strong></p>
      <p>Wrangle's pricing is public: <strong>Starter at $199/seat/month</strong> (unlimited sourcing, ATS connection, email sequences, unlimited exports, 5,000 monthly credits) and <strong>Scale at $499/seat/month</strong> (adds LinkedIn outreach, inbound sourcing, all agent models, priority support, 20,000 monthly credits). A team can see the real cost and start a free trial without a demo call \u2014 a genuine point of difference against platforms later in this guide that require contacting sales just to learn the price.</p>
      <p><strong>A Complete Workflow, Not Just Outreach</strong></p>
      <p>Wrangle covers sourcing, live company intelligence (headcount, funding stage, growth signals), Collections as a shared candidate CRM, outreach sequences, interview scheduling, and AI-generated interview notes \u2014 all in one platform, with ATS sync to Ashby, Greenhouse, Lever, and Recruit CRM on the Scale plan.</p>
      <p><strong>The Bottom Line on Wrangle</strong></p>
      <p>For recruiting teams that want AI-native sourcing and outreach with published pricing and disclosed accuracy data, Wrangle is the strongest starting point in this category. It's a particularly strong fit for teams that have found Gem or hireEZ more expensive or opaque than their volume justifies, and for teams that want to evaluate real numbers before a sales conversation rather than after one.</p>
      <hr>
      <h2>The Leading Candidate Outreach and Automation Platforms</h2>
      <h3>Gem</h3>
      <p><strong>Alternative for: Corporate recruiting teams running high-volume outbound with deep CRM needs</strong></p>
      <p>Gem is one of the most widely adopted recruiting CRM and outreach platforms, with real strengths in pipeline analytics and ATS integrations, and a strong 4.8/5 G2 rating built on a large customer base (1,200+ companies including Airbnb, DoorDash, and Zillow). The real cost story is worth knowing before you evaluate it: Gem's only published pricing tier (Startups) is priced by your company's total employee headcount, not your recruiting team size \u2014 a growing company pays more even without adding recruiters. Real buyer contract data (Vendr, 218 verified purchases) shows a median annual cost of <strong>$24,900</strong>, with enterprise deals averaging $94,560/year. Its AI sourcing is also credit-capped even on the published tier. For teams that don't need Gem's full CRM depth, Wrangle's published $199-$499/seat pricing is dramatically more predictable.</p>
      <p><strong>Trade-off:</strong> Real cost scales with total company size, not recruiting team size, and the published tier caps AI sourcing usage.</p>
      <hr>
      <h3>hireEZ (formerly Hiretual)</h3>
      <p><strong>Alternative for: Teams prioritizing AI-powered sourcing alongside outreach</strong></p>
      <p>hireEZ combines an 800M+ profile open-web database with multi-channel outreach, and has a genuine, established 4.6/5 G2 rating. It doesn't publish pricing anywhere, and real buyer contract data (Vendr) shows a <strong>median annual cost of $13,000</strong>, with some deals reaching $48,000 \u2014 well above typical per-seat sticker estimates for this category. Contracts also commonly include renewal price-escalation clauses reported at 15-30% in year two. There's no self-serve signup; access starts with a sales demo.</p>
      <p><strong>Trade-off:</strong> No published pricing, a real median cost well into five figures, and renewal contracts that can increase substantially in year two.</p>
      <hr>
      <h3>SeekOut</h3>
      <p><strong>Alternative for: Enterprise teams sourcing specialized or hard-to-find talent</strong></p>
      <p>SeekOut's real pricing has two faces. Its self-serve Recruit Core tier is a genuinely affordable $149/mo and includes 3 seats \u2014 but the 500 contact credits/month are pooled across the whole account, working out to roughly 167 lookups per person for a full 3-person team. The moment a team needs more seats or deeper features, SeekOut requires a custom quote, and verified contract data (Vendr, 64 executed deals) shows a median cost of <strong>$20,000 per seat, per year</strong> at that tier. SeekOut's diversity/DEI sourcing filters are a genuine, well-regarded specialization worth knowing about if compliance-driven filtering is a hard requirement.</p>
      <p><strong>Trade-off:</strong> The 3 included seats share a contact-credit pool that a genuinely active team burns through fast; real team-scale pricing runs several times Wrangle's published per-seat rate.</p>
      <hr>
      <h3>Fetcher</h3>
      <p><strong>Best for: Teams that want an optional human-curated layer on top of AI sourcing</strong></p>
      <p>Fetcher pairs a 500M+ candidate database with an optional human sourcing team on its higher tiers. Its entry tier ($115/mo) is genuinely cheaper than Wrangle's Starter plan for very light use, but it comes with hard annual sourcing caps (500 sourced candidates/year on Growth, 1,000/year on Amplify) that a team hiring steadily across multiple roles can exhaust well before the year is out \u2014 at which point the only option is negotiating a custom Enterprise deal. Fetcher also doesn't offer built-in interview scheduling at any tier.</p>
      <p><strong>Trade-off:</strong> Cheap entry tier, but a real ceiling on sourcing volume that Wrangle's unlimited-search model doesn't share.</p>
      <hr>
      <h2>The Bottom Line</h2>
      <p>Gem, hireEZ, SeekOut, and the other platforms in this guide are capable tools with real user bases. For the teams they were built for, they deliver \u2014 but several of them share a pattern worth naming plainly: pricing that isn't published, real costs that run well above the entry number once you need a team, or usage caps that bite as you scale.</p>
      <p>Wrangle is built differently on both counts. It's AI-native by architecture, with disclosed benchmark results (93.71% Hit@1, 97.64% Hit@10) backing that claim rather than just asserting it. And its pricing \u2014 $199/seat/month for Starter, $499 for Scale \u2014 is published, fixed, and visible before you ever talk to a salesperson.</p>
      <p>For any recruiting team evaluating this category in 2026, start with the platform that shows you the real numbers first.</p>
    `,
    "order": 0
  },
  {
    "slug": "wrangle-vs-linkedin-recruiter-natural-language-sourcing",
    "title": "Wrangle vs LinkedIn Recruiter: Natural Language Sourcing Compared (2026)",
    "date": "August 25, 2026",
    "readTime": "7 min read",
    "author": "Wrangle",
    "category": "changelog",
    "cover": "steps",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "How natural-language sourcing stacks up against LinkedIn Recruiter in 2026.",
    "status": "published",
    "order": 1
  },
  {
    "slug": "ai-people-search-benchmark",
    "title": "AI People Search Benchmark 2026: Wrangle vs. Exa, Juicebox & More",
    "date": "Aug 20, 2026",
    "readTime": "4 min read",
    "author": "Wrangle",
    "category": "resources",
    "cover": "orbit",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "Disclosed benchmark results against Exa, Juicebox, and other AI people-search tools.",
    "status": "published",
    "order": 2
  },
  {
    "slug": "introducing-market-mapping",
    "title": "Introducing Market Mapping",
    "date": "Aug 8, 2026",
    "readTime": "5 min read",
    "author": "Wrangle",
    "category": "changelog",
    "cover": "tiles",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "Map the talent landscape around any company or function in one view.",
    "status": "published",
    "order": 3
  },
  {
    "slug": "generative-ai-sourcing-vs-traditional-recruiting-tools",
    "title": "Generative AI Sourcing vs. Traditional Recruiting Tools",
    "date": "May 18, 2026",
    "readTime": "5 min read",
    "author": "Wrangle",
    "category": "resources",
    "cover": "window",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "Why generative AI sourcing is changing how recruiters find and engage talent.",
    "status": "published",
    "order": 4
  },
  {
    "slug": "wrangle-vs-fetcher",
    "title": "Wrangle vs. Fetcher \u2014 AI Sourcing Platform Comparison (2026)",
    "date": "May 14, 2026",
    "readTime": "5 min read",
    "author": "Wrangle",
    "category": "resources",
    "cover": "steps",
    "coverImage": "/landing/blog/placeholder.png",
    "excerpt": "A side-by-side AI sourcing comparison: Wrangle vs. Fetcher in 2026.",
    "status": "published",
    "order": 5
  }
];

const DATA_DIR = path.join(process.cwd(), "server", "data", "posts");
const BLOB_PATH = "blog/posts.json";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function slugify(title) {
  return title.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "post";
}
function isValidSlug(slug) {
  return SLUG_RE.test(slug) && slug.length <= 120;
}
function sanitizeHtml(html) {
  return html.replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, "").replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}
let seedPromise;
function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}
async function ensureSeeded() {
  seedPromise != null ? seedPromise : seedPromise = (async () => {
    await promises.mkdir(DATA_DIR, { recursive: true });
    const existing = await promises.readdir(DATA_DIR);
    if (existing.some((f) => f.endsWith(".json"))) return;
    await Promise.all(SEED_POSTS.map(
      (post, index) => promises.writeFile(
        path.join(DATA_DIR, `${post.slug}.json`),
        JSON.stringify({ ...post, order: index }, null, 2),
        "utf8"
      )
    ));
  })().catch((error) => {
    seedPromise = void 0;
    throw error;
  });
  return seedPromise;
}
function sortByListOrder(posts) {
  return [...posts].sort(
    (a, b) => {
      var _a, _b;
      return ((_a = a.order) != null ? _a : Number.MAX_SAFE_INTEGER) - ((_b = b.order) != null ? _b : Number.MAX_SAFE_INTEGER) || (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0);
    }
  );
}
function normalizePosts(value) {
  if (!Array.isArray(value)) return [];
  return sortByListOrder(value.filter((post) => typeof post === "object" && post !== null && "slug" in post && typeof post.slug === "string" && isValidSlug(post.slug)));
}
async function readAllFromBlob() {
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return [];
  return normalizePosts(JSON.parse(await new Response(result.stream).text()));
}
async function writeAllToBlob(posts) {
  await put(BLOB_PATH, JSON.stringify(posts, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
}
async function readAllFromFileSystem() {
  await ensureSeeded();
  const files = await promises.readdir(DATA_DIR);
  const posts = await Promise.all(files.filter((f) => f.endsWith(".json")).map(async (f) => {
    try {
      return JSON.parse(await promises.readFile(path.join(DATA_DIR, f), "utf8"));
    } catch {
      return null;
    }
  }));
  return normalizePosts(posts);
}
async function readAll() {
  return usesBlobStorage() ? readAllFromBlob() : readAllFromFileSystem();
}
async function writePost(post) {
  if (usesBlobStorage()) {
    const posts = await readAllFromBlob();
    const index = posts.findIndex((candidate) => candidate.slug === post.slug);
    if (index === -1) posts.push(post);
    else posts[index] = post;
    await writeAllToBlob(sortByListOrder(posts));
    return;
  }
  await promises.mkdir(DATA_DIR, { recursive: true });
  await promises.writeFile(path.join(DATA_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2), "utf8");
}
async function nextOrder() {
  const posts = await readAll();
  return posts.reduce((max, p) => {
    var _a;
    return Math.max(max, (_a = p.order) != null ? _a : 0);
  }, -1) + 1;
}
async function reorderPosts(slugs) {
  if (usesBlobStorage()) {
    const posts = await readAllFromBlob();
    const order2 = new Map(slugs.map((slug, index) => [slug, index]));
    for (const post of posts) {
      if (order2.has(post.slug)) post.order = order2.get(post.slug);
    }
    await writeAllToBlob(sortByListOrder(posts));
    return;
  }
  await ensureSeeded();
  const order = new Map(slugs.map((slug, index) => [slug, index]));
  await Promise.all(slugs.map(async (slug) => {
    const file = path.join(DATA_DIR, `${slug}.json`);
    const post = JSON.parse(await promises.readFile(file, "utf8"));
    post.order = order.get(slug);
    await promises.writeFile(file, JSON.stringify(post, null, 2), "utf8");
  }));
}
function sortByPublicationDate(posts) {
  const timestamp = (post) => {
    const parsed = Date.parse(post.date);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return [...posts].sort((a, b) => timestamp(b) - timestamp(a));
}
async function listPosts(options = {}) {
  const posts = await readAll();
  return (options.includeDrafts ? posts : sortByPublicationDate(posts)).filter((p) => options.includeDrafts || p.status === "published").map(({ body: _body, markdown: _markdown, ...listItem }) => listItem);
}
async function getPost(slug) {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug);
}
async function getRelated(slug, count = 4) {
  const posts = (await readAll()).filter((p) => p.slug !== slug && p.status === "published");
  return sortByPublicationDate(posts).slice(0, count).map(({ body: _body, markdown: _markdown, ...listItem }) => listItem);
}
async function slugExists(slug) {
  return getPost(slug).then((p) => p !== void 0);
}
function validatePost(input) {
  var _a, _b, _c;
  if (!((_a = input.title) == null ? void 0 : _a.trim())) return "Title is required.";
  if (!input.slug || !isValidSlug(input.slug)) return "Slug must be lowercase letters, numbers, and dashes.";
  if (!Number.isFinite(Date.parse((_b = input.date) != null ? _b : ""))) return "Date is invalid.";
  if (input.category !== null && input.category !== "resources" && input.category !== "changelog" && input.category !== "news") return "Category is invalid.";
  if (input.status !== "draft" && input.status !== "published" && input.status !== "unpublished") return "Status is invalid.";
  if (!((_c = input.excerpt) == null ? void 0 : _c.trim())) return "Excerpt is required.";
  return null;
}
function hasTranslationContent(content) {
  if (!content) return false;
  return ["title", "excerpt", "markdown", "body"].some((field) => {
    const value = content[field];
    return typeof value === "string" && Boolean(value.trim());
  });
}
function validateTranslation(content, label) {
  if (!hasTranslationContent(content)) return null;
  if (typeof (content == null ? void 0 : content.title) !== "string" || !content.title.trim()) return `${label} title is required.`;
  if (typeof content.excerpt !== "string" || !content.excerpt.trim()) return `${label} excerpt is required.`;
  const hasBody = typeof content.markdown === "string" && Boolean(content.markdown.trim()) || typeof content.body === "string" && Boolean(content.body.trim());
  if (!hasBody) return `${label} content is required.`;
  return null;
}
function normalizeTranslations(translations) {
  if (!translations) return void 0;
  const normalized = Object.fromEntries(Object.entries(translations).flatMap(([locale, content]) => {
    var _a, _b, _c;
    if (!content) return [];
    const markdown = content.markdown;
    return [[locale, {
      ...content,
      title: (_a = content.title) == null ? void 0 : _a.trim(),
      excerpt: (_b = content.excerpt) == null ? void 0 : _b.trim(),
      body: (_c = content.body) != null ? _c : (markdown == null ? void 0 : markdown.trim()) ? sanitizeHtml(renderPostHtml(markdown)) : void 0
    }]];
  }));
  return Object.keys(normalized != null ? normalized : {}).length ? normalized : void 0;
}
async function savePost(input) {
  var _a, _b, _c;
  const post = {
    ...input,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    coverImage: ((_a = input.coverImage) == null ? void 0 : _a.trim()) || void 0,
    // Markdown is the source of truth; fall back to an existing/seed HTML body.
    body: (_c = input.body) != null ? _c : ((_b = input.markdown) == null ? void 0 : _b.trim()) ? sanitizeHtml(renderPostHtml(input.markdown)) : void 0,
    translations: normalizeTranslations(input.translations)
  };
  await writePost(post);
  return post;
}
async function deletePostBySlug(slug) {
  if (usesBlobStorage()) {
    const posts = await readAllFromBlob();
    const remaining = posts.filter((post) => post.slug !== slug);
    if (remaining.length === posts.length) return false;
    await writeAllToBlob(remaining);
    return true;
  }
  await ensureSeeded();
  try {
    await promises.unlink(path.join(DATA_DIR, `${slug}.json`));
    return true;
  } catch {
    return false;
  }
}
function renderPostHtml(markdown) {
  return renderMarkdown(markdown);
}

export { deletePostBySlug, getPost, getRelated, hasTranslationContent, isValidSlug, listPosts, nextOrder, reorderPosts, sanitizeHtml, savePost, slugExists, slugify, validatePost, validateTranslation };
//# sourceMappingURL=blog-store.mjs.map
