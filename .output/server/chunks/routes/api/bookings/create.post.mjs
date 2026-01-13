import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie, $ as $fetch, r as readBody } from '../../../_/nitro.mjs';
import { U as UPDATE_BOOK_STATUS } from '../../../_/update_book_status.mjs';
import { U as UPDATE_PAYMENT } from '../../../_/update_payment.mjs';
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

const MUTATION_CREATE_BOOKING = `
  mutation CreateBooking(
    $name: String!, 
    $contact: String!, 
    $email: String!, 
    $institution: String, 
    $suratFile: Upload, 
    $isAcademic: Boolean,
    $details: [BookingDetailInput!]!
    $status: BookingStatus
    $paymentStatus: PaymentStatus
  ) {
    createBooking(
      name: $name, 
      contact: $contact, 
      email: $email, 
      institution: $institution,
      suratFile: $suratFile, 
      isAcademic: $isAcademic,
      details: $details,
      status: $status,
      paymentStatus: $paymentStatus
    ) {
      bookingCode
    }
  }
`;

const create_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const contentType = event.node.req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    const token = getCookie(event, "admin_token");
    const headers = {
      "apollo-require-preflight": "true",
      "content-type": contentType
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(endpoint, { method: "POST", headers, body: event.node.req, duplex: "half" });
      const json = await res.json();
      if ((_a = json.errors) == null ? void 0 : _a.length) {
        throw createError({ statusCode: 400, statusMessage: ((_b = json.errors[0]) == null ? void 0 : _b.message) || "Failed to create booking" });
      }
      const bookingData = (_c = json.data) == null ? void 0 : _c.createBooking;
      if (!(bookingData == null ? void 0 : bookingData.bookingCode)) {
        return bookingData;
      }
      try {
        await $fetch(endpoint, {
          method: "POST",
          body: {
            query: UPDATE_BOOK_STATUS,
            variables: { bookingCode: bookingData.bookingCode, status: "APPROVED" }
          },
          headers: { "Content-Type": "application/json", ...token && { "Authorization": `Bearer ${token}` } }
        });
        await $fetch(endpoint, {
          method: "POST",
          body: {
            query: UPDATE_PAYMENT,
            variables: { bookingCode: bookingData.bookingCode, paymentStatus: "UNPAID" }
          },
          headers: { "Content-Type": "application/json", ...token && { "Authorization": `Bearer ${token}` } }
        });
      } catch (err) {
        console.warn("Failed to auto-approve academic booking:", err == null ? void 0 : err.message);
      }
      return bookingData;
    } catch (err) {
      if (err == null ? void 0 : err.statusCode) throw err;
      throw createError({ statusCode: 502, statusMessage: (err == null ? void 0 : err.message) || "Booking service unreachable" });
    }
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.name) || !(body == null ? void 0 : body.contact) || !(body == null ? void 0 : body.email) || !Array.isArray(body.details) || body.details.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Incomplete booking payload" });
  }
  try {
    const token = getCookie(event, "admin_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_CREATE_BOOKING,
        variables: {
          name: body.name,
          contact: body.contact,
          email: body.email,
          institution: body.institution,
          suratUrl: body.suratUrl,
          isAcademic: body.isAcademic,
          details: body.details
        }
      },
      headers
    });
    if ((_d = response.errors) == null ? void 0 : _d.length) {
      throw createError({ statusCode: 400, statusMessage: ((_e = response.errors[0]) == null ? void 0 : _e.message) || "Failed to create booking" });
    }
    const bookingData = (_f = response.data) == null ? void 0 : _f.createBooking;
    if (!(bookingData == null ? void 0 : bookingData.bookingCode)) {
      throw createError({ statusCode: 500, statusMessage: "Booking created but no booking code returned" });
    }
    const statusResponse = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: UPDATE_BOOK_STATUS,
        variables: {
          bookingCode: bookingData.bookingCode,
          status: "APPROVED"
        }
      },
      headers
    });
    if ((_g = statusResponse.errors) == null ? void 0 : _g.length) {
      console.warn("Failed to update booking status:", (_h = statusResponse.errors[0]) == null ? void 0 : _h.message);
    }
    try {
      const paymentResponse = await $fetch(endpoint, {
        method: "POST",
        body: {
          query: UPDATE_PAYMENT,
          variables: {
            bookingCode: bookingData.bookingCode,
            paymentStatus: "UNPAID"
          }
        },
        headers
      });
      if ((_i = paymentResponse.errors) == null ? void 0 : _i.length) {
        console.warn("Failed to update payment status:", (_j = paymentResponse.errors[0]) == null ? void 0 : _j.message);
      }
    } catch (err) {
      const details = (err == null ? void 0 : err.data) || ((_k = err == null ? void 0 : err.response) == null ? void 0 : _k.data) || (err == null ? void 0 : err.message);
      console.error("GraphQL payment mutation error:", details);
      if ((_m = (_l = err == null ? void 0 : err.data) == null ? void 0 : _l.errors) == null ? void 0 : _m.length) {
        throw createError({ statusCode: 400, statusMessage: ((_n = err.data.errors[0]) == null ? void 0 : _n.message) || "Failed to update payment status" });
      }
      throw createError({ statusCode: 502, statusMessage: (err == null ? void 0 : err.message) || "Booking service unreachable" });
    }
    return bookingData;
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: (error == null ? void 0 : error.message) || "Booking service unreachable" });
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
