import { d as defineEventHandler, g as getRequestHeader, c as createError, r as readMultipartFormData } from '../../../nitro/nitro.mjs';
import { M as MAX_BLOG_COVER_BYTES, s as storeBlogCover } from '../../../_/blog-cover-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';

const blogCovers_post = defineEventHandler(async (event) => {
  var _a;
  const contentLength = Number((_a = getRequestHeader(event, "content-length")) != null ? _a : 0);
  if (contentLength > MAX_BLOG_COVER_BYTES + 64 * 1024) {
    throw createError({ statusCode: 413, statusMessage: "\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 8 MB\u3002" });
  }
  const parts = await readMultipartFormData(event);
  const file = parts == null ? void 0 : parts.find((part) => part.name === "file" && part.filename);
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "\u8BF7\u9009\u62E9\u8981\u4E0A\u4F20\u7684\u56FE\u7247\u3002" });
  }
  try {
    return await storeBlogCover(file.data);
  } catch (error) {
    if (error instanceof Error && error.message === "EMPTY_IMAGE") {
      throw createError({ statusCode: 400, statusMessage: "\u4E0A\u4F20\u7684\u56FE\u7247\u4E3A\u7A7A\u3002" });
    }
    if (error instanceof Error && error.message === "IMAGE_TOO_LARGE") {
      throw createError({ statusCode: 413, statusMessage: "\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 8 MB\u3002" });
    }
    if (error instanceof Error && error.message === "UNSUPPORTED_IMAGE") {
      throw createError({ statusCode: 415, statusMessage: "\u4EC5\u652F\u6301 PNG\u3001JPG\u3001WebP \u6216 GIF \u56FE\u7247\u3002" });
    }
    console.error("[blog-cover] Upload failed:", error);
    throw createError({ statusCode: 500, statusMessage: "\u5C01\u9762\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002\u539F\u8DEF\u5F84\u672A\u66F4\u6539\u3002" });
  }
});

export { blogCovers_post as default };
//# sourceMappingURL=blog-covers.post.mjs.map
