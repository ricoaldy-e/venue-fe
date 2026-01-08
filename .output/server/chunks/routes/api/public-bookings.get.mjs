import { d as defineEventHandler, b as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { Q as QUERY_GET_BOOKINGS } from '../../_/get_bookings.mjs';
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

const publicBookings_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const { stadionId, date } = getQuery(event);
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const serviceToken = process.env.GQL_SERVICE_TOKEN || process.env.GQL_PUBLIC_TOKEN || "";
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: QUERY_GET_BOOKINGS,
        variables: { stadionId, date }
      },
      headers: {
        "Content-Type": "application/json",
        ...serviceToken ? { Authorization: serviceToken } : {}
      }
    });
    if ((_a = response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "Failed to load bookings"
      });
    }
    return (_d = (_c = response.data) == null ? void 0 : _c.bookings) != null ? _d : [];
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: (error == null ? void 0 : error.message) || "Booking service unreachable" });
  }
});

export { publicBookings_get as default };
//# sourceMappingURL=public-bookings.get.mjs.map
