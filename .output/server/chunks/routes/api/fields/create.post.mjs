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

const MUTATION_CREATE_FIELD = `
  mutation CreateField(
    $stadionId: Int!
    $name: String!
    $description: String
    $pricePerHour: Int!
    $images: [FieldImageInput!]
    $status: Status
  ) {
    createField(
      stadionId: $stadionId
      name: $name
      description: $description
      pricePerHour: $pricePerHour
      images: $images
      status: $status
    ) {
      id
      name
      status
    }
  }
`;

const create_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const variables = {
      name: body.name,
      description: body.description,
      stadionId: Number(body.stadionId),
      // HARGA DISEMBUNYIKAN: Terima dari body (default 0 dari FE)
      // Tidak hardcode agar nanti bisa reactive kalau fitur diaktifkan
      pricePerHour: Number(body.pricePerHour || 0),
      status: body.status,
      images: body.images
    };
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_CREATE_FIELD,
        variables
      },
      headers: { "Authorization": `Bearer ${token}` },
      ignoreResponseError: true
    });
    if (response.errors) {
      const msg = response.errors[0].message;
      throw createError({ statusCode: 400, statusMessage: msg });
    }
    return response.data.createField;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
