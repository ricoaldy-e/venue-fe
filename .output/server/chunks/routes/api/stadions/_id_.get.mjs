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

const QUERY_GET_STADION_BY_ID = `
  query GetStadionById($stadionId: ID!) {
    stadion(stadionId: $stadionId) {
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
          icon
        }
      }
      images {
        id
        imageUrl
      }
      fields {
        id
        name
        description
        pricePerHour
        status
        images {
          id
          imageUrl
        }
      }
    }
  }
`;

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const stadionId = (_a = event.context.params) == null ? void 0 : _a.id;
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: QUERY_GET_STADION_BY_ID,
        variables: { stadionId }
      }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.stadion;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
