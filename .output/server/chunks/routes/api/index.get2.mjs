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

const QUERY_GET_FACILITIES = `
  query GetFacilities {
    facilities {
      id
      name
      icon
    }
  }
`;

const index_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: { query: QUERY_GET_FACILITIES }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.facilities;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
