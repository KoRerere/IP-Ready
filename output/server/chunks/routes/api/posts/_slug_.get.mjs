import { d as defineEventHandler, i as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { getPost, getRelated } from '../../../_/blog-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';
import '../../../_/markdown.mjs';

const _slug__get = defineEventHandler(async (event) => {
  var _a;
  const slug = String((_a = getRouterParam(event, "slug")) != null ? _a : "");
  const post = await getPost(slug);
  if (!post || post.status !== "published") {
    throw createError({ statusCode: 404, statusMessage: "Post not found." });
  }
  return { post, related: await getRelated(slug) };
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
