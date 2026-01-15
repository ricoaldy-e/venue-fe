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

const QUERY_GET_FACILITY_BY_ID = `
  query GetFacilityById($facilityId: ID!) {
    facility(facilityId: $facilityId) {
      id
      name
      icon
    }
  }
`;

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const facilityId = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!facilityId) throw createError({ statusCode: 400, statusMessage: "Missing Facility ID" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: QUERY_GET_FACILITY_BY_ID,
        variables: { facilityId }
      }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.facility;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
