import { d as defineEventHandler, i as getRouterParam, c as createError, o as setResponseHeader } from '../../../nitro/nitro.mjs';
import { promises } from 'node:fs';
import path from 'node:path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:crypto';
import 'node:url';

const FILE_RE = /^cover-[0-9]+-[a-f0-9-]+\.(png|jpg|webp|gif)$/;
const CONTENT_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif"
};
const _name_ = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const filename = String((_a = getRouterParam(event, "name")) != null ? _a : "");
  if (!FILE_RE.test(filename)) {
    throw createError({ statusCode: 404, statusMessage: "Image not found." });
  }
  const roots = /* @__PURE__ */ new Set();
  for (const start of [process.cwd(), path.dirname(process.execPath)]) {
    let current = path.resolve(start);
    for (let depth = 0; depth < 7; depth += 1) {
      roots.add(path.join(current, "server", "data", "uploads"));
      roots.add(path.join(current, "app", "server", "data", "uploads"));
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  try {
    let data;
    for (const root of roots) {
      try {
        data = await promises.readFile(path.join(root, filename));
        break;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    if (!data) throw createError({ statusCode: 404, statusMessage: "Image not found." });
    const extension = (_b = filename.split(".").pop()) != null ? _b : "";
    setResponseHeader(event, "Content-Type", (_c = CONTENT_TYPES[extension]) != null ? _c : "application/octet-stream");
    setResponseHeader(event, "Cache-Control", "public, max-age=86400");
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createError({ statusCode: 404, statusMessage: "Image not found." });
    }
    throw error;
  }
});

export { _name_ as default };
//# sourceMappingURL=_name_.mjs.map
