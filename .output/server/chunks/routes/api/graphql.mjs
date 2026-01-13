import { d as defineEventHandler, u as useRuntimeConfig, c as createError, r as readBody, g as getCookie, $ as $fetch } from '../../nitro/nitro.mjs';
import { a as AUTH } from '../../_/constants.mjs';
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

const graphql = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const body = await readBody(event);
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME);
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...token && { Authorization: `Bearer ${token}` }
      },
      body
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "GraphQL Error"
      });
    }
    return response;
  } catch (error) {
    if (error.statusCode === 404) {
      throw createError({ statusCode: 502, statusMessage: "Backend GraphQL server is not running." });
    }
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: "Internal server error during proxy." });
  }
});

export { graphql as default };
//# sourceMappingURL=graphql.mjs.map
