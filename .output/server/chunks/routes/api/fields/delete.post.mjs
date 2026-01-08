import { d as defineEventHandler, r as readBody, c as createError, g as getCookie, $ as $fetch } from '../../../nitro/nitro.mjs';
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

const MUTATION_DELETE_FIELD = `
  mutation DeleteField($fieldId: ID!) {
    deleteField(fieldId: $fieldId) {
      id
      name
    }
  }
`;

const delete_post = defineEventHandler(async (event) => {
  const { fieldId } = await readBody(event);
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_DELETE_FIELD,
        variables: { fieldId }
      },
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.errors) throw new Error(response.errors[0].message);
    return response.data.deleteField;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { delete_post as default };
//# sourceMappingURL=delete.post.mjs.map
