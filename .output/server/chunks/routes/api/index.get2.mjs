import { d as defineEventHandler, c as createError, $ as $fetch } from '../../nitro/nitro.mjs';
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
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
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
