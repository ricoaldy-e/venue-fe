import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig, $ as $fetch, s as setCookie } from '../../../nitro/nitro.mjs';
import { A as API, a as AUTH } from '../../../_/constants.mjs';
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

const MUTATION_LOGIN = `
  mutation Login($email: String!, $password: String!, $turnstile: String!) {
    login(email: $email, password: $password, turnstile: $turnstile) {
      token
      admin { id name email }
    }
  }
`;

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const config = useRuntimeConfig();
  const { email, password, turnstile } = await readBody(event);
  console.log(turnstile);
  if (!email || !password)
    throw createError({ statusCode: 400, statusMessage: "Email & password required" });
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint)
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  try {
    const resp = await $fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { query: MUTATION_LOGIN, variables: { email, password, turnstile } },
      timeout: API.TIMEOUT,
      retry: API.RETRY_COUNT
    });
    if ((_a = resp == null ? void 0 : resp.errors) == null ? void 0 : _a.length) {
      const first = resp.errors[0];
      const msg = (first == null ? void 0 : first.message) || "Invalid credentials";
      const code = ((_b = first == null ? void 0 : first.extensions) == null ? void 0 : _b.code) === "UNAUTHENTICATED" ? 401 : 400;
      throw createError({ statusCode: code, statusMessage: msg });
    }
    const data = (_c = resp == null ? void 0 : resp.data) == null ? void 0 : _c.login;
    if (!(data == null ? void 0 : data.token))
      throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    setCookie(event, AUTH.TOKEN_COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: AUTH.TOKEN_MAX_AGE
    });
    return { ok: true, admin: data.admin };
  } catch (err) {
    console.log(err);
    if ((err == null ? void 0 : err.name) === "FetchError" || ((_d = err == null ? void 0 : err.message) == null ? void 0 : _d.includes("timeout"))) {
      throw createError({ statusCode: 502, statusMessage: "Auth service unreachable" });
    }
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError({ statusCode: 500, statusMessage: "Unexpected error" });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
