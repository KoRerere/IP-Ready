import { d as defineEventHandler, i as getRouterParam, c as createError, o as setResponseHeader } from '../../nitro/nitro.mjs';
import { r as readBlogCover } from '../../_/blog-cover-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';

const _name__get = defineEventHandler(async (event) => {
  var _a;
  const filename = String((_a = getRouterParam(event, "name")) != null ? _a : "");
  const cover = await readBlogCover(filename);
  if (!cover) {
    throw createError({ statusCode: 404, statusMessage: "Image not found." });
  }
  setResponseHeader(event, "Content-Type", cover.contentType);
  setResponseHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
  if (cover.etag) setResponseHeader(event, "ETag", cover.etag);
  return cover.data;
});

export { _name__get as default };
//# sourceMappingURL=_name_.get.mjs.map
