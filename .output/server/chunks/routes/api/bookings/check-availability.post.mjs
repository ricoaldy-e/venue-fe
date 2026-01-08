import { d as defineEventHandler, g as getCookie, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
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

const query = `
    query CheckBookingAvailability($fieldId: ID!, $date: String!) {
        bookings(where: {
        fieldId: { equals: $fieldId }
        bookDate: { equals: $date }
        bookStatus: { notIn: ["CANCEL", "FAILED"] }
        }) {
        id
        timeSlot
        }
    }
`;

const checkAvailability_post = defineEventHandler(async (event) => {
  var _a, _b;
  const token = getCookie(event, AUTH.TOKEN_COOKIE_NAME);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const secret = process.env.JWT_SECRET;
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
    const graphqlUrl = process.env.GRAPHQL_ENDPOINT || "http://localhost:3001/graphql";
    const response = await $fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          fieldId: body.fieldId,
          date: body.date
        }
      }),
      timeout: API.TIMEOUT
    });
    if (response.errors) {
      throw createError({
        statusCode: 500,
        statusMessage: ((_a = response.errors[0]) == null ? void 0 : _a.message) || "GraphQL error"
      });
    }
    const existingBookings = ((_b = response.data) == null ? void 0 : _b.bookings) || [];
    const relevantBookings = body.excludeBookingId ? existingBookings.filter((b) => b.id !== body.excludeBookingId) : existingBookings;
    const bookedSlots = new Set(relevantBookings.map((b) => b.timeSlot));
    const conflictingSlots = body.timeSlots.filter((slot) => bookedSlots.has(slot));
    if (conflictingSlots.length > 0) {
      return {
        available: false,
        conflictingSlots,
        message: `Slot waktu ${conflictingSlots.join(", ")} sudah dibooking. Silakan pilih slot lain.`
      };
    }
    return {
      available: true,
      conflictingSlots: [],
      message: "Semua slot waktu tersedia"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to check availability"
    });
  }
});

export { checkAvailability_post as default };
//# sourceMappingURL=check-availability.post.mjs.map
