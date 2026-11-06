import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { listPosts } from '../../_/blog-store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@vercel/blob';
import '../../_/markdown.mjs';

const posts_get = defineEventHandler(async () => {
  return listPosts();
});

export { posts_get as default };
//# sourceMappingURL=posts.get.mjs.map
