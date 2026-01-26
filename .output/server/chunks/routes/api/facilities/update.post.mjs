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

const MUTATION_UPDATE_FACILITY = `
  mutation UpdateFacility(
    $facilityId: ID!
    $name: String!
    $icon: String
  ) {
    updateFacility(
      facilityId: $facilityId
      name: $name
      icon: $icon
    ) {
      id
      name
      icon
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
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_UPDATE_FACILITY,
        variables: {
          facilityId: body.facilityId,
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
    return response.data.updateFacility;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
