import { c as defineEventHandler, r as readBody, u as useRuntimeConfig, e as createError, g as getCookie } from '../../../_/nitro.mjs';
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

const MUTATION_UPDATE_OPTION = `
    mutation UpdateOption($name: String!, $nameKet: String!, $description: String!, $unitName: String!, $unitDesc: String!, $email: String!, $nohp: String!, $address: String!) {
        updateOption(name: $name, nameKet: $nameKet, description: $description, unitName: $unitName, unitDesc: $unitDesc, email: $email, nohp: $nohp, address: $address) {
            id
            name
            nameKet
            description
            unitName
            unitDesc
            email
            nohp
            address
        }
    }
`;

const update_post = defineEventHandler(async (event) => {
  var _a;
  const { name, nameKet, description, unitName, unitDesc, email, nohp, address } = await readBody(event);
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  if (!name || !nameKet || !description || !unitName || !unitDesc || !email || !nohp || !address) {
    throw createError({ statusCode: 400, statusMessage: "Incomplete payload" });
  }
  try {
    const res = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: MUTATION_UPDATE_OPTION,
        variables: {
          name,
          nameKet,
          description,
          unitName,
          unitDesc,
          email,
          nohp,
          address
        }
      }
    });
    if (res.errors && res.errors.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_a = res.errors[0]) == null ? void 0 : _a.message) || "Failed to update options"
      });
    }
    return res.data.updateOption;
  } catch (e) {
    const err = e;
    if (err.statusCode) throw err;
    throw createError({ statusCode: 502, message: "Option service unreachable" });
  }
});

export { update_post as default };
//# sourceMappingURL=update.post.mjs.map
