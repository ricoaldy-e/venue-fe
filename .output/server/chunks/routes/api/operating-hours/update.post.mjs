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

const MUTATION_UPDATE_OPERATING_HOUR = `
  mutation UpdateOperatingHour($openHour: Int!, $closeHour: Int!) {
    updateOperatingHour(openHour: $openHour, closeHour: $closeHour) {
      id
      openHour
      closeHour
    }
  }
`;

const isValidHour = (value) => Number.isInteger(value) && value >= 0 && value <= 24;
const update_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  if ((body == null ? void 0 : body.openHour) === void 0 || (body == null ? void 0 : body.closeHour) === void 0) {
    throw createError({ statusCode: 400, statusMessage: "Incomplete payload" });
  }
  const openHour = Number(body.openHour);
  const closeHour = Number(body.closeHour);
  if (!isValidHour(openHour) || !isValidHour(closeHour)) {
    throw createError({ statusCode: 400, statusMessage: "Jam harus berada antara 0-24" });
  }
  if (closeHour <= openHour) {
    throw createError({ statusCode: 400, statusMessage: "Jam tutup harus lebih besar daripada jam buka" });
  }
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: MUTATION_UPDATE_OPERATING_HOUR,
        variables: {
          openHour,
          closeHour
        }
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "Failed to update operating hour"
      });
    }
    return (_c = response == null ? void 0 : response.data) == null ? void 0 : _c.updateOperatingHour;
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: "Operating hour service unreachable" });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
