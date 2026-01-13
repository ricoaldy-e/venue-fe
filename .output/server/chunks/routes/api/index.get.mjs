import { c as defineEventHandler, i as getQuery, u as useRuntimeConfig, e as createError, g as getCookie } from '../../_/nitro.mjs';
import { Q as QUERY_GET_BOOKINGS } from '../../_/get_bookings.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = getQuery(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  const stadionId = body.stadionId;
  const date = body.date;
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: QUERY_GET_BOOKINGS,
        variables: { stadionId, date }
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "Failed to get bookings"
      });
    }
    return (_c = response.data) == null ? void 0 : _c.bookings;
  } catch (error) {
    if (error) throw error;
    throw createError({ statusCode: 502, statusMessage: "Bookings service unreachable" });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
