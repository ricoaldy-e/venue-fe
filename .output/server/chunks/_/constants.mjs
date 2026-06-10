const AUTH = {
  TOKEN_MAX_AGE: 60 * 60 * 24 * 7,
  TOKEN_COOKIE_NAME: "admin_token",
  SESSION_TIMEOUT_WARNING: 5 * 60 * 1e3
};
const API = {
  TIMEOUT: 5 * 60 * 1e3,
  RETRY_COUNT: 0,
  CACHE_TTL: {
    STADIONS: 60,
    FACILITIES: 300,
    FIELDS: 60,
    BOOKINGS: 30
  }
};

export { API as A, AUTH as a };
//# sourceMappingURL=constants.mjs.map
