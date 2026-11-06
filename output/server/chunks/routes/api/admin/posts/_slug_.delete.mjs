import { d as defineEventHandler, i as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { deletePostBySlug } from '../../../../_/blog-store.mjs';
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

const _slug__delete = defineEventHandler(async (event) => {
  var _a;
  const slug = String((_a = getRouterParam(event, "slug")) != null ? _a : "");
  const deleted = await deletePostBySlug(slug);
  if (!deleted) throw createError({ statusCode: 404, statusMessage: "Post not found." });
  return { ok: true };
});

export { _slug__delete as default };
//# sourceMappingURL=_slug_.delete.mjs.map
