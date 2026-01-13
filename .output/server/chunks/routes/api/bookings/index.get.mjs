import { c as defineEventHandler, h as getRouterParams, u as useRuntimeConfig, e as createError } from '../../../_/nitro.mjs';
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

const QUERY_GET_BOOKING = `
  query Booking($bookingCode: String!) {
    booking(bookingCode: $bookingCode) {
      bookingCode,
      name,
      contact,
      email,
      institution,
      suratUrl,
      isAcademic,
      totalPrice,
      status,
      paymentStatus,
      createdAt,
      details {
        bookingDate,
        startHour,
        subtotal,
        Field {
          name
        }
      }
    }
  }
`;

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const { bookingCode } = getRouterParams(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, message: "missing GQL enpoint" });
  }
  const response = await $fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      query: QUERY_GET_BOOKING,
      variables: { bookingCode }
    }
  });
  if ((_a = response.errors) == null ? void 0 : _a.length) {
    throw createError({ statusCode: 400, message: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "failed to get booking detail" });
  }
  return (_c = response.data) == null ? void 0 : _c.booking;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
