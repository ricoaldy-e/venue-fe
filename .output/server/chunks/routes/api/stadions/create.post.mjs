import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie, $ as $fetch } from '../../../_/nitro.mjs';
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

const MUTATION_CREATE_STADION = `
  mutation CreateStadion(
    $name: String!
    $description: String
    $mapUrl: String!
    $status: Status
    $facilityIds: [Int]
  ) {
    createStadion(
      name: $name
      description: $description
      mapUrl: $mapUrl
      status: $status
      facilityIds: $facilityIds
    ) {
      id
      name
      status
      facilities {
        id
        Facility {
          id
          name
          icon
        }
      }
    }
  }
`;

const create_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_CREATE_STADION,
        variables: {
          name: body.name,
          description: body.description,
          mapUrl: body.mapUrl,
          status: body.status,
          facilityIds: Array.isArray(body.facilityIds) && body.facilityIds.length > 0 ? body.facilityIds.map(Number) : null
        }
      },
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.errors) {
      const msg = response.errors[0].message;
      throw createError({ statusCode: 400, statusMessage: msg });
    }
    return response.data.createStadion;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
