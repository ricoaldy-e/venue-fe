import { c as defineEventHandler, u as useRuntimeConfig, g as getCookie, e as createError, r as readBody } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import { A as API, a as AUTH } from '../../../_/constants.mjs';
import { Q as QUERY_GET_BOOKINGS } from '../../../_/get_bookings.mjs';
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

const checkAvailability_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const secret = config.jwtSecret;
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: "JWT_SECRET missing" });
  }
  try {
    jwt.verify(token, secret);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
  const body = await readBody(event);
  if (!body.fieldId || !body.date || !body.timeSlots || body.timeSlots.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: fieldId, date, timeSlots"
    });
  }
  try {
    const graphqlUrl = config.public.gqlHttpEndpoint || "http://localhost:4000/graphql";
    const response = await $fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: QUERY_GET_BOOKINGS,
        variables: {
          date: body.date
        }
      }),
      timeout: API.TIMEOUT
    });
    if (response.errors) {
      console.error("[check-availability] GraphQL errors:", response.errors);
      throw createError({
        statusCode: 500,
        statusMessage: ((_a = response.errors[0]) == null ? void 0 : _a.message) || "GraphQL error"
      });
    }
    const allBookings = ((_c = (_b = response.data) == null ? void 0 : _b.bookings) == null ? void 0 : _c.data) || [];
    const relevantBookings = allBookings.filter((booking) => {
      if (booking.status === "CANCELLED") return false;
      if (body.excludeBookingId && booking.id === body.excludeBookingId) return false;
      return true;
    });
    const bookedSlots = /* @__PURE__ */ new Set();
    for (const booking of relevantBookings) {
      if (booking.details) {
        for (const detail of booking.details) {
          if (String(detail.fieldId) === String(body.fieldId)) {
            const detailDate = new Date(detail.bookingDate);
            const requestDate = new Date(body.date);
            const getLocalDateKey = (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            };
            const detailDateStr = getLocalDateKey(detailDate);
            const requestDateStr = getLocalDateKey(requestDate);
            if (detailDateStr === requestDateStr) {
              bookedSlots.add(String(detail.startHour));
            }
          }
        }
      }
    }
    const conflictingSlots = body.timeSlots.filter((slot) => bookedSlots.has(slot));
    if (conflictingSlots.length > 0) {
      return {
        available: false,
        conflictingSlots,
        message: `Slot Tidak Tersedia: Slot waktu yang dipilih sudah dibooking oleh pengguna lain. Silakan pilih slot yang berbeda atau coba lagi.`
      };
    }
    return {
      available: true,
      conflictingSlots: [],
      message: "Semua slot waktu tersedia"
    };
  } catch (error) {
    console.error("[check-availability] Error:", (error == null ? void 0 : error.message) || error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to check availability"
    });
  }
});

export { checkAvailability_post as default };
//# sourceMappingURL=check-availability.post.mjs.map
