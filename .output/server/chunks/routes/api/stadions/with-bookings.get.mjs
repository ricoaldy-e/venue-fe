import { c as defineEventHandler, u as useRuntimeConfig, e as createError, $ as $fetch } from '../../../_/nitro.mjs';
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
      bookingCount
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
        priceTendik
        status
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

const withBookings_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  try {
    const [stadionsRes] = await Promise.all([
      $fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { query: QUERY_STADIONS_DATA }
      })
    ]);
    if (stadionsRes.errors) throw new Error(stadionsRes.errors[0].message);
    const stadions = stadionsRes.data.stadions;
    return stadions;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { withBookings_get as default };
//# sourceMappingURL=with-bookings.get.mjs.map
