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

const MUTATION_UPDATE_STADION = `
  mutation UpdateStadion(
    $stadionId: ID!
    $name: String!
    $description: String
    $mapUrl: String!
    $status: Status
    $facilityIds: [Int]
  ) {
    updateStadion(
      stadionId: $stadionId
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

const update_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      body: {
        query: MUTATION_UPDATE_STADION,
        variables: {
          stadionId: Number(body.stadionId),
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
    return response.data.updateStadion;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
