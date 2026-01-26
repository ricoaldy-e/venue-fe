import { c as defineEventHandler, u as useRuntimeConfig, e as createError, $ as $fetch } from '../../_/nitro.mjs';
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

const QUERY_GET_STADIONS = `
  query StadionsWithDetails {
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
      }
    }
  }
`;

useRuntimeConfig();
const index_get = defineEventHandler(async (event) => {
  const config2 = useRuntimeConfig();
  const endpoint = config2.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        query: QUERY_GET_STADIONS
      }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.stadions;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get6.mjs.map
