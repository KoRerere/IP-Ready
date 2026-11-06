import { d as defineEventHandler, o as setResponseHeader } from '../nitro/nitro.mjs';
import { listPosts } from '../_/blog-store.mjs';

const SITE_URL = "https://ipready.cc";
function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[character]);
}
function buildSitemap(posts) {
  const entries = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    `  <url><loc>${SITE_URL}/blog</loc></url>`,
    `  <url><loc>${SITE_URL}/check</loc></url>`,
    `  <url><loc>${SITE_URL}/batch-check</loc></url>`,
    ...posts.map((post) => {
      const url = escapeXml(`${SITE_URL}/blog/${encodeURIComponent(post.slug)}`);
      const timestamp = Date.parse(post.date);
      const lastmod = Number.isFinite(timestamp) ? `<lastmod>${new Date(timestamp).toISOString()}</lastmod>` : "";
      return `  <url><loc>${url}</loc>${lastmod}</url>`;
    })
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

const sitemap_xml_get = defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return buildSitemap(await listPosts());
});

const sitemap_xml_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_xml_get
}, Symbol.toStringTag, { value: 'Module' }));

const sitemapIndex_xml_get = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_xml_get
}, Symbol.toStringTag, { value: 'Module' }));

export { sitemapIndex_xml_get as a, sitemap_xml_get$1 as s };
//# sourceMappingURL=sitemap-index.xml.get.mjs.map
