import { randomUUID } from 'node:crypto';
import { promises } from 'node:fs';
import path from 'node:path';
import { put, get } from '@vercel/blob';

const MAX_BLOG_COVER_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "server", "data", "uploads");
const GENERATED_COVER_RE = /^cover-[0-9]+-[a-f0-9]{12}\.(png|jpg|webp|gif)$/;
function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}
function detectImageFormat(data) {
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { extension: "png", contentType: "image/png" };
  }
  if (data.length >= 3 && data[0] === 255 && data[1] === 216 && data[2] === 255) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }
  if (data.length >= 6 && (data.subarray(0, 6).toString("ascii") === "GIF87a" || data.subarray(0, 6).toString("ascii") === "GIF89a")) {
    return { extension: "gif", contentType: "image/gif" };
  }
  if (data.length >= 12 && data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") {
    return { extension: "webp", contentType: "image/webp" };
  }
  return void 0;
}
async function storeBlogCover(data) {
  if (data.length === 0) throw new Error("EMPTY_IMAGE");
  if (data.length > MAX_BLOG_COVER_BYTES) throw new Error("IMAGE_TOO_LARGE");
  const format = detectImageFormat(data);
  if (!format) throw new Error("UNSUPPORTED_IMAGE");
  const filename = `cover-${Date.now()}-${randomUUID().replaceAll("-", "").slice(0, 12)}.${format.extension}`;
  if (usesBlobStorage()) {
    await put(`blog-covers/${filename}`, data, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: format.contentType,
      cacheControlMaxAge: 31536e3
    });
  } else {
    await promises.mkdir(UPLOAD_DIR, { recursive: true });
    await promises.writeFile(path.join(UPLOAD_DIR, filename), data, { flag: "wx" });
  }
  return {
    filename,
    path: `/blog-covers/${filename}`,
    contentType: format.contentType,
    size: data.length
  };
}
async function readBlogCover(filename) {
  if (!GENERATED_COVER_RE.test(filename)) return void 0;
  if (usesBlobStorage()) {
    const result = await get(`blog-covers/${filename}`, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return void 0;
    return {
      data: Buffer.from(await new Response(result.stream).arrayBuffer()),
      contentType: result.blob.contentType,
      etag: result.blob.etag
    };
  }
  try {
    const data = await promises.readFile(path.join(UPLOAD_DIR, filename));
    const format = detectImageFormat(data);
    return format ? { data, contentType: format.contentType } : void 0;
  } catch (error) {
    if (error.code === "ENOENT") return void 0;
    throw error;
  }
}

export { MAX_BLOG_COVER_BYTES as M, readBlogCover as r, storeBlogCover as s };
//# sourceMappingURL=blog-cover-store.mjs.map
