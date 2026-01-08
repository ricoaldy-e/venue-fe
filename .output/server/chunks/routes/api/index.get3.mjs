import { d as defineEventHandler, c as createError, g as getCookie, b as getQuery, $ as $fetch } from '../../nitro/nitro.mjs';
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

const QUERY_GET_FIELDS = `
  query FieldsDashboard($stadionId: ID) {
    fields(stadionId: $stadionId) {
      id
      stadionId
      name
      description
      pricePerHour
      status
      Stadion {
        id
        name
      }
      images {
        imageUrl
      }
      bookingDetails {
        id
        bookingDate
        startHour
        subtotal
      }
    }
  }
`;

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const endpoint = process.env.GQL_HTTP_ENDPOINT;
  if (!endpoint) throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  const token = getCookie(event, "admin_token");
  const { stadionId } = getQuery(event);
  try {
    const body = { query: QUERY_GET_FIELDS };
    if (stadionId) {
      body.variables = { stadionId: String(stadionId) };
    }
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await $fetch(endpoint, {
      method: "POST",
      headers,
      body
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      console.error("[fields/index] GraphQL error", response.errors);
      throw createError({
        statusCode: 400,
        statusMessage: response.errors.map((e) => e == null ? void 0 : e.message).join(" | ") || "GraphQL error"
      });
    }
    const fields = (_c = (_b = response == null ? void 0 : response.data) == null ? void 0 : _b.fields) != null ? _c : [];
    return fields.map((field) => {
      var _a2, _b2;
      return {
        ...field,
        stadion: (_b2 = (_a2 = field.Stadion) != null ? _a2 : field.stadion) != null ? _b2 : null
      };
    });
  } catch (err) {
    console.error("[fields/index] upstream failure", err);
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError({ statusCode: 502, statusMessage: (err == null ? void 0 : err.message) || "Upstream error" });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
