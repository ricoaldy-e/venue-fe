import { d as defineEventHandler, a as getRouterParams, r as readBody, g as getCookie, u as useRuntimeConfig, c as createError } from '../../../../nitro/nitro.mjs';
import { U as UPDATE_BOOK_STATUS } from '../../../../_/update_book_status.mjs';
import { U as UPDATE_PAYMENT } from '../../../../_/update_payment.mjs';
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

const status_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const { bookingCode } = getRouterParams(event);
  const body = await readBody(event);
  const token = getCookie(event, "admin_token");
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, message: "missing GQL endpoint" });
  }
  const bookingStatus = body == null ? void 0 : body.bookingStatus;
  if (!bookingStatus) {
    throw createError({ statusCode: 400, message: "bookingStatus is required" });
  }
  const response = await $fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: {
      query: UPDATE_BOOK_STATUS,
      variables: { bookingCode, status: bookingStatus }
    }
  });
  if ((_a = response.errors) == null ? void 0 : _a.length) {
    throw createError({ statusCode: 400, message: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "failed to update booking status" });
  }
  if (bookingStatus === "CANCELLED") {
    try {
      await $fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: {
          query: UPDATE_PAYMENT,
          variables: { bookingCode, paymentStatus: "UNPAID" }
        }
      });
    } catch (err) {
      console.warn("Failed to update payment status on cancel:", err);
    }
  }
  return (_c = response.data) == null ? void 0 : _c.updateBookingStatus;
});

export { status_post as default };
//# sourceMappingURL=status.post.mjs.map
