import { d as defineEventHandler, a as getRouterParams, g as getCookie, r as readBody, u as useRuntimeConfig, c as createError } from '../../../../nitro/nitro.mjs';
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

const payment_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const { bookingCode } = getRouterParams(event);
  const token = getCookie(event, "admin_token");
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, message: "missing GQL endpoint" });
  }
  const paymentStatus = body == null ? void 0 : body.paymentStatus;
  if (!paymentStatus) {
    throw createError({ statusCode: 400, message: "paymentStatus is required" });
  }
  const response = await $fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: {
      query: UPDATE_PAYMENT,
      variables: { bookingCode, paymentStatus }
    }
  });
  if ((_a = response.errors) == null ? void 0 : _a.length) {
    throw createError({ statusCode: 400, message: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "failed to update payment status" });
  }
  return (_c = response.data) == null ? void 0 : _c.updatePaymentStatus;
});

export { payment_post as default };
//# sourceMappingURL=payment.post.mjs.map
