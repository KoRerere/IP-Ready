import { d as defineEventHandler, f as deleteCookie, A as ADMIN_COOKIE } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, ADMIN_COOKIE, { path: "/" });
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
