import { d as defineEventHandler, a as readBody, v as verifyPassword, c as createError, s as setCookie, b as createSessionToken, A as ADMIN_COOKIE, e as sessionCookieOptions } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  if (!(body == null ? void 0 : body.password) || !verifyPassword(body.password)) {
    throw createError({ statusCode: 401, statusMessage: "Incorrect password." });
  }
  setCookie(event, ADMIN_COOKIE, createSessionToken(), sessionCookieOptions());
  return { ok: true };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
