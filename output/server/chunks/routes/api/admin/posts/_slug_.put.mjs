import { d as defineEventHandler, i as getRouterParam, c as createError, a as readBody } from '../../../../nitro/nitro.mjs';
import { c as computeReadTime } from '../../../../_/markdown.mjs';
import { getPost, hasTranslationContent, validateTranslation, validatePost, slugExists, savePost } from '../../../../_/blog-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';

const _slug__put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
  const currentSlug = String((_a = getRouterParam(event, "slug")) != null ? _a : "");
  const existing = await getPost(currentSlug);
  if (!existing) throw createError({ statusCode: 404, statusMessage: "Post not found." });
  const input = await readBody(event);
  const nextSlug = ((_b = input.slug) == null ? void 0 : _b.trim()) || currentSlug;
  const incomingEnglish = (_c = input.translations) == null ? void 0 : _c.en;
  const title = (_e = (_d = input.title) != null ? _d : incomingEnglish == null ? void 0 : incomingEnglish.title) != null ? _e : existing.title;
  const excerpt = (_g = (_f = input.excerpt) != null ? _f : incomingEnglish == null ? void 0 : incomingEnglish.excerpt) != null ? _g : existing.excerpt;
  const markdown = (_m = (_l = (_i = (_h = input.markdown) != null ? _h : incomingEnglish == null ? void 0 : incomingEnglish.markdown) != null ? _i : existing.markdown) != null ? _l : (_k = (_j = existing.translations) == null ? void 0 : _j.en) == null ? void 0 : _k.markdown) != null ? _m : "";
  const author = ((_n = input.author) == null ? void 0 : _n.trim()) || ((_o = incomingEnglish == null ? void 0 : incomingEnglish.author) == null ? void 0 : _o.trim()) || existing.author;
  const readTimeWasProvided = Object.prototype.hasOwnProperty.call(input, "readTime") || Boolean(incomingEnglish && Object.prototype.hasOwnProperty.call(incomingEnglish, "readTime"));
  const submittedReadTime = ((_p = input.readTime) == null ? void 0 : _p.trim()) || ((_q = incomingEnglish == null ? void 0 : incomingEnglish.readTime) == null ? void 0 : _q.trim());
  const readTime = submittedReadTime || (readTimeWasProvided ? computeReadTime(markdown) : existing.readTime || computeReadTime(markdown));
  const existingEnglish = (_r = existing.translations) == null ? void 0 : _r.en;
  const englishMarkdownChanged = markdown !== ((_t = (_s = existingEnglish == null ? void 0 : existingEnglish.markdown) != null ? _s : existing.markdown) != null ? _t : "");
  const topLevelMarkdownChanged = markdown !== ((_u = existing.markdown) != null ? _u : "");
  const translations = {
    ...existing.translations,
    ...input.translations,
    en: {
      ...existingEnglish,
      ...incomingEnglish,
      title,
      excerpt,
      author,
      readTime,
      markdown,
      body: englishMarkdownChanged ? incomingEnglish == null ? void 0 : incomingEnglish.body : (_w = (_v = incomingEnglish == null ? void 0 : incomingEnglish.body) != null ? _v : existingEnglish == null ? void 0 : existingEnglish.body) != null ? _w : existing.body
    }
  };
  if (input.translations && Object.prototype.hasOwnProperty.call(input.translations, "zh")) {
    const incomingChinese = input.translations.zh;
    if (hasTranslationContent(incomingChinese)) {
      const translationError = validateTranslation(incomingChinese, "Chinese");
      if (translationError) throw createError({ statusCode: 400, statusMessage: translationError });
      const existingChinese = (_x = existing.translations) == null ? void 0 : _x.zh;
      const chineseMarkdown = (_z = (_y = incomingChinese == null ? void 0 : incomingChinese.markdown) != null ? _y : existingChinese == null ? void 0 : existingChinese.markdown) != null ? _z : "";
      const chineseMarkdownChanged = chineseMarkdown !== ((_A = existingChinese == null ? void 0 : existingChinese.markdown) != null ? _A : "");
      translations.zh = {
        ...existingChinese,
        ...incomingChinese,
        author,
        readTime,
        markdown: chineseMarkdown,
        body: chineseMarkdownChanged ? incomingChinese == null ? void 0 : incomingChinese.body : (_B = incomingChinese == null ? void 0 : incomingChinese.body) != null ? _B : existingChinese == null ? void 0 : existingChinese.body
      };
    } else {
      delete translations.zh;
    }
  } else if (translations.zh) {
    translations.zh = { ...translations.zh, author, readTime };
  }
  const error = validatePost({
    ...existing,
    ...input,
    slug: nextSlug,
    date: (_C = input.date) != null ? _C : existing.date,
    excerpt: (_D = input.excerpt) != null ? _D : existing.excerpt
  });
  if (error) throw createError({ statusCode: 400, statusMessage: error });
  if (nextSlug !== currentSlug && await slugExists(nextSlug)) {
    throw createError({ statusCode: 409, statusMessage: "A post with this slug already exists." });
  }
  const merged = {
    ...existing,
    ...input,
    slug: nextSlug,
    title,
    excerpt,
    markdown,
    author,
    readTime,
    body: topLevelMarkdownChanged ? input.body : (_E = input.body) != null ? _E : existing.body,
    translations
  };
  const saved = await savePost(merged);
  if (nextSlug !== currentSlug) {
    const { deletePostBySlug } = await import('../../../../_/blog-store.mjs');
    await deletePostBySlug(currentSlug);
  }
  return saved;
});

export { _slug__put as default };
//# sourceMappingURL=_slug_.put.mjs.map
