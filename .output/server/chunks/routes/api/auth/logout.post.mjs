import { c as defineEventHandler, f as setCookie } from '../../../_/nitro.mjs';
import { a as AUTH } from '../../../_/constants.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'better-sqlite3';
import 'ipx';
import 'node:crypto';

const logout_post = defineEventHandler(async (event) => {
  setCookie(event, AUTH.TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return { ok: true, message: "Logged out successfully" };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
