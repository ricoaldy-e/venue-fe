import { c as defineEventHandler, u as useRuntimeConfig, e as createError, g as getCookie, j as getQuery } from '../../../_/nitro.mjs';
import { a as QUERY_GET_BOOKINGS_PAGINATED } from '../../../_/get_bookings.mjs';
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

const history_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const endpoint = config.public.gqlHttpEndpoint;
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: "Missing GQL_HTTP_ENDPOINT" });
  }
  const token = getCookie(event, "admin_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  const query = getQuery(event);
  const toIsoDate = (dateStr) => {
    if (!dateStr) return void 0;
    if (dateStr.includes("T")) return dateStr;
    return `${dateStr}T00:00:00.000+07:00`;
  };
  const toIsoDateEnd = (dateStr) => {
    if (!dateStr) return void 0;
    if (dateStr.includes("T")) return dateStr;
    return `${dateStr}T23:59:59.999+07:00`;
  };
  const variables = {
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
    sortOrder: query.sortOrder || "desc",
    status: query.status || void 0,
    paymentStatus: query.paymentStatus || void 0,
    renterType: query.renterType || void 0,
    search: query.search || void 0,
    stadionId: query.stadionId || void 0,
    startDate: toIsoDate(query.startDate),
    endDate: toIsoDateEnd(query.endDate),
    date: toIsoDate(query.date)
  };
  try {
    const response = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: {
        query: QUERY_GET_BOOKINGS_PAGINATED,
        variables
      }
    });
    if ((_a = response == null ? void 0 : response.errors) == null ? void 0 : _a.length) {
      throw createError({
        statusCode: 400,
        statusMessage: ((_b = response.errors[0]) == null ? void 0 : _b.message) || "Failed to get bookings history"
      });
    }
    const defaultResponse = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      summary: {
        totalRevenue: 0,
        totalCount: 0,
        paidCount: 0,
        unpaidCount: 0,
        academicCount: 0,
        nonAcademicCount: 0,
        academicRevenue: 0,
        nonAcademicRevenue: 0,
        paidPercentage: 0,
        averagePerBooking: 0,
        approvedCount: 0,
        cancelledCount: 0,
        pendingCount: 0
      }
    };
    return ((_c = response.data) == null ? void 0 : _c.bookings) || defaultResponse;
  } catch (error) {
    if (error == null ? void 0 : error.statusCode) throw error;
    throw createError({ statusCode: 502, statusMessage: "Bookings service unreachable" });
  }
});

export { history_get as default };
//# sourceMappingURL=history.get.mjs.map
