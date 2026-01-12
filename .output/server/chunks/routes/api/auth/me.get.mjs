import { d as defineEventHandler, g as getCookie, u as useRuntimeConfig, c as createError } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
import { a as AUTH } from '../../../_/constants.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'ipx';

const me_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME);
  if (!token) return { authenticated: false };
  const secret = config.jwtSecret;
  if (!secret) throw createError({ statusCode: 500, statusMessage: "JWT_SECRET missing" });
  try {
    const payload = jwt.verify(token, secret);
    return {
      authenticated: true,
      payload,
      expiresAt: payload.exp * 1e3
    };
  } catch {
    return { authenticated: false };
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
