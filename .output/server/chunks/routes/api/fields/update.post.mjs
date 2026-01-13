import { c as defineEventHandler, r as readBody, u as useRuntimeConfig, e as createError, g as getCookie, $ as $fetch } from '../../../_/nitro.mjs';
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

const MUTATION_UPDATE_FIELD = `
  mutation UpdateField(
    $fieldId: ID!
    $stadionId: Int!
    $name: String!
    $description: String
    $pricePerHour: Int!
    $images: [FieldImageInput!]
    $status: Status
  ) {
    updateField(
      fieldId: $fieldId
      stadionId: $stadionId
      name: $name
      description: $description
      pricePerHour: $pricePerHour
      images: $images
      status: $status
    ) {
      id
      stadionId
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
`;

const update_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const variables = {
      fieldId: String(body.fieldId),
      stadionId: Number(body.stadionId),
      name: body.name,
      description: body.description,
      // HARGA DISEMBUNYIKAN: Terima dari body (default 0 dari FE)
      // Tidak hardcode agar nanti bisa reactive kalau fitur diaktifkan
      pricePerHour: Number(body.pricePerHour || 0),
      status: body.status,
      images: body.images
    };
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_UPDATE_FIELD,
        variables
      },
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.errors) {
      const msg = response.errors[0].message;
      throw createError({ statusCode: 400, statusMessage: msg });
    }
    return response.data.updateField;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
