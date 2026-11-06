import { d as defineEventHandler, a as readBody, c as createError, h as setResponseStatus } from '../../../nitro/nitro.mjs';
import { c as computeReadTime } from '../../../_/markdown.mjs';
import { hasTranslationContent, nextOrder, slugify, validatePost, validateTranslation, slugExists, savePost } from '../../../_/blog-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';

const posts_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
  const input = await readBody(event);
  const author = ((_a = input.author) == null ? void 0 : _a.trim()) || ((_d = (_c = (_b = input.translations) == null ? void 0 : _b.en) == null ? void 0 : _c.author) == null ? void 0 : _d.trim()) || "IP Ready Team";
  const markdown = (_h = (_g = input.markdown) != null ? _g : (_f = (_e = input.translations) == null ? void 0 : _e.en) == null ? void 0 : _f.markdown) != null ? _h : "";
  const readTime = ((_i = input.readTime) == null ? void 0 : _i.trim()) || ((_l = (_k = (_j = input.translations) == null ? void 0 : _j.en) == null ? void 0 : _k.readTime) == null ? void 0 : _l.trim()) || computeReadTime(markdown);
  const title = (_p = (_o = input.title) != null ? _o : (_n = (_m = input.translations) == null ? void 0 : _m.en) == null ? void 0 : _n.title) != null ? _p : "Untitled";
  const excerpt = (_t = (_s = input.excerpt) != null ? _s : (_r = (_q = input.translations) == null ? void 0 : _q.en) == null ? void 0 : _r.excerpt) != null ? _t : "";
  const chinese = (_u = input.translations) == null ? void 0 : _u.zh;
  const hasChinese = hasTranslationContent(chinese);
  const payload = {
    slug: ((_v = input.slug) == null ? void 0 : _v.trim()) || slugify((_w = input.title) != null ? _w : ""),
    title,
    date: ((_x = input.date) == null ? void 0 : _x.trim()) || (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    readTime,
    author,
    category: (_y = input.category) != null ? _y : "resources",
    cover: (_z = input.cover) != null ? _z : "window",
    coverImage: input.coverImage,
    excerpt,
    markdown,
    body: input.body,
    translations: {
      en: {
        ...(_A = input.translations) == null ? void 0 : _A.en,
        title,
        excerpt,
        author,
        readTime,
        markdown,
        body: (_D = (_C = (_B = input.translations) == null ? void 0 : _B.en) == null ? void 0 : _C.body) != null ? _D : input.body
      },
      ...hasChinese ? {
        zh: {
          ...chinese,
          author,
          readTime
        }
      } : {}
    },
    status: (_E = input.status) != null ? _E : "draft",
    order: await nextOrder()
  };
  if (!((_F = payload.markdown) == null ? void 0 : _F.trim()) && !((_G = payload.body) == null ? void 0 : _G.trim())) {
    throw createError({ statusCode: 400, statusMessage: "\u6587\u7AE0\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A(\u8BF7\u586B\u5199 Markdown \u6B63\u6587)\u3002" });
  }
  const error = validatePost(payload);
  if (error) throw createError({ statusCode: 400, statusMessage: error });
  const translationError = validateTranslation(chinese, "Chinese");
  if (translationError) throw createError({ statusCode: 400, statusMessage: translationError });
  if (await slugExists(payload.slug)) {
    throw createError({ statusCode: 409, statusMessage: "A post with this slug already exists." });
  }
  setResponseStatus(event, 201);
  return savePost(payload);
});

export { posts_post as default };
//# sourceMappingURL=posts.post.mjs.map
