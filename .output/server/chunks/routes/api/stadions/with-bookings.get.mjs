import { d as defineEventHandler, u as useRuntimeConfig, c as createError, $ as $fetch } from '../../../nitro/nitro.mjs';
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

const QUERY_STADIONS_DATA = `
  query StadionsData {
    stadions {
      id
      name
      description
      mapUrl
      status
      operatingHours {
        openHour
        closeHour
      }
      facilities {
        Facility {
          id
          name
        }
      }
      images {
        id
        imageUrl
      }
      fields {
        id
        name
        pricePerHour
        images {
          id
          imageUrl
        }
        bookingDetails {
          bookingId
        }
      }
    }
  }
`;

const QUERY_BOOKINGS_WITH_DETAILS = `
  query BookingsWithDetails($startDate: DateTime, $endDate: DateTime) {
    bookings(startDate: $startDate, endDate: $endDate) {
      id
      bookingCode
      status
      details {
        id
        fieldId
        bookingDate
        startHour
      }
    }
  }
`;

useRuntimeConfig();
const withBookings_get = defineEventHandler(async (event) => {
  const config2 = useRuntimeConfig();
  const endpoint = config2.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  try {
    const [stadionsRes, bookingsRes] = await Promise.all([
      $fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { query: QUERY_STADIONS_DATA }
      }),
      $fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          query: QUERY_BOOKINGS_WITH_DETAILS,
          variables: {
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2026-12-31T23:59:59Z"
          }
        }
      })
    ]);
    if (stadionsRes.errors) throw new Error(stadionsRes.errors[0].message);
    if (bookingsRes.errors) throw new Error(bookingsRes.errors[0].message);
    const stadions = stadionsRes.data.stadions;
    const bookings = bookingsRes.data.bookings || [];
    const fieldBookingsMap = /* @__PURE__ */ new Map();
    bookings.forEach((booking) => {
      var _a;
      (_a = booking.details) == null ? void 0 : _a.forEach((detail) => {
        const fieldId = String(detail.fieldId);
        if (!fieldBookingsMap.has(fieldId)) {
          fieldBookingsMap.set(fieldId, []);
        }
        fieldBookingsMap.get(fieldId).push({
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          Booking: {
            status: booking.status
          }
        });
      });
    });
    const mergedStadions = stadions.map((stadion) => ({
      ...stadion,
      fields: stadion.fields.map((field) => {
        const fieldId = String(field.id);
        const bookingsForField = fieldBookingsMap.get(fieldId) || [];
        return {
          ...field,
          bookingDetails: bookingsForField
        };
      })
    }));
    return mergedStadions;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { withBookings_get as default };
//# sourceMappingURL=with-bookings.get.mjs.map
