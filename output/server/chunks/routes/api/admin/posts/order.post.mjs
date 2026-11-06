import { d as defineEventHandler, a as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { getPost, reorderPosts } from '../../../../_/blog-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';
import '../../../../_/markdown.mjs';

const order_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const slugs = body == null ? void 0 : body.slugs;
  if (!Array.isArray(slugs) || !slugs.length) {
    throw createError({ statusCode: 400, statusMessage: "slugs array is required." });
  }
  for (const slug of slugs) {
    if (!await getPost(slug)) {
      throw createError({ statusCode: 400, statusMessage: `Unknown slug: ${slug}` });
    }
  }
  await reorderPosts(slugs);
  return { ok: true, count: slugs.length };
});

export { order_post as default };
//# sourceMappingURL=order.post.mjs.map
