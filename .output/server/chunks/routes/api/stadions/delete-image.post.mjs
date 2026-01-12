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

const MUTATION_DELETE_STADION_IMAGE = `
  mutation DeleteStadionImage($imageId: ID!) {
    deleteStadionImage(imageId: $imageId) {
      id
      imageUrl
    }
  }
`;

const deleteImage_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imageIds } = body;
  if (!Array.isArray(imageIds) || imageIds.length === 0) return [];
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  if (!token) throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  try {
    const results = [];
    for (const id of imageIds) {
      const response = await $fetch(endpoint, {
        method: "POST",
        body: {
          query: MUTATION_DELETE_STADION_IMAGE,
          variables: { imageId: Number(id) }
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.errors) throw new Error(response.errors[0].message);
      results.push(response.data.deleteStadionImage);
    }
    return results;
  } catch (err) {
    throw createError({ statusCode: 502, statusMessage: err.message });
  }
});

export { deleteImage_post as default };
//# sourceMappingURL=delete-image.post.mjs.map
