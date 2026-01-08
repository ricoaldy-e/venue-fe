import { d as defineEventHandler, c as createError, g as getCookie } from '../../../nitro/nitro.mjs';
import { Q as QUERY_GET_BOOKINGS } from '../../../_/get_bookings.mjs';
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

const history_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: QUERY_GET_BOOKINGS,
        variables: {}
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "Failed to get bookings history"
      });
    }
    const bookings = ((_c = response.data) == null ? void 0 : _c.bookings) || [];
    const sortedBookings = bookings.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return sortedBookings;
  } catch (error) {
    if (error) throw error;
    throw createError({ statusCode: 502, statusMessage: "Bookings service unreachable" });
  }
});

export { history_get as default };
//# sourceMappingURL=history.get.mjs.map
