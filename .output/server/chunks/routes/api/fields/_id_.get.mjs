import { d as defineEventHandler, c as createError, $ as $fetch } from '../../../nitro/nitro.mjs';
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

const QUERY_GET_FIELD_BY_ID = `
  query GetFieldById($fieldId: ID!) {
    field(fieldId: $fieldId) {
      id
      stadionId
      name
      description
      pricePerHour
      status
      images { id imageUrl }
      Stadion { id name }
    }
  }
`;

const _id__get = defineEventHandler(async (event) => {
  var _a;
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const fieldId = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!fieldId) throw createError({ statusCode: 400, statusMessage: "Missing Field ID" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: QUERY_GET_FIELD_BY_ID,
        variables: { fieldId }
      }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.field;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
