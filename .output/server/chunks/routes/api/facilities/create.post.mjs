import { d as defineEventHandler, r as readBody, u as useRuntimeConfig, c as createError, g as getCookie, $ as $fetch } from '../../../nitro/nitro.mjs';
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

const MUTATION_CREATE_FACILITY = `
  mutation CreateFacility(
    $name: String!
    $icon: String
  ) {
    createFacility(
      name: $name
      icon: $icon
    ) {
      id
      name
      icon
    }
  }
`;

const create_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_CREATE_FACILITY,
        variables: {
          name: body.name,
          icon: body.icon
        }
      },
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.errors) {
      const msg = response.errors[0].message;
      throw createError({ statusCode: 400, statusMessage: msg });
    }
    return response.data.createFacility;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
