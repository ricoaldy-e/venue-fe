export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 50,
} as const

export const AUTH = {
  TOKEN_MAX_AGE: 60 * 60 * 24 * 7,
  TOKEN_COOKIE_NAME: 'admin_token',
  SESSION_TIMEOUT_WARNING: 5 * 60 * 1000,
} as const

export const OPERATING_HOURS = {
  DEFAULT_OPEN: 6,
  DEFAULT_CLOSE: 22,
  MIN_HOUR: 0,
  MAX_HOUR: 23,
} as const

export const BOOKING = {
  CART_EXPIRY_MINUTES: 20,
} as const

export const SEARCH = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
} as const

export const VALIDATION = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  PHONE_REGEX: /^(\+62|62|0)[0-9]{9,13}$/,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  URL_REGEX: /^https?:\/\/.+/,
  NAME_REGEX: /^[a-zA-Z\s.]+$/,
  SQL_INJECTION_PATTERNS: [
    /('\s*(OR|AND)\s*'?\d*'?\s*=\s*'?\d*)/gi, // ' OR '1'='1, ' OR 1=1
    /('\s*(OR|AND)\s+\d+\s*=\s*\d+)/gi, // ' OR 1=1, ' AND 1=1
    /(;\s*(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE))/gi, // ; DROP, ; DELETE, etc
    /('\s*;\s*(--|#))/gi, // '; --, '; #
    /(UNION\s+(ALL\s+)?SELECT)/gi, // UNION SELECT, UNION ALL SELECT
    /('\s*--)/g, // ' --
    /('\s*#)/g, // ' #
    /(\bEXEC\s*\(|\bEXECUTE\s*\()/gi, // EXEC(, EXECUTE(
    /('\s*OR\s+'[^']*'\s*=\s*')/gi, // ' OR 'x'='
    /(;\s*SHUTDOWN)/gi, // ; SHUTDOWN
    /(\bxp_cmdshell\b)/gi, // xp_cmdshell
  ],
} as const

export function detectSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  const trimmedInput = input.trim()

  return VALIDATION.SQL_INJECTION_PATTERNS.some(pattern => {
    return pattern.test(trimmedInput)
  })
}

export const STATUS = {
  BOOKING: {
    // PENDING: 'PENDING', // Temporarily disabled - not currently in use
    APPROVED: 'APPROVED',
    CANCELLED: 'CANCELLED',
    // REJECTED: 'REJECTED', // Temporarily disabled - not in BE schema
  },
  PAYMENT: {
    UNPAID: 'UNPAID',
    PAID: 'PAID',
    // REFUNDED: 'REFUNDED',
  },
  ENTITY: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  },
  FIELD: {
    READY: 'Ready',
    MAINTENANCE: 'Maintenance',
  },
} as const

export const UI = {
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 300,
  SKELETON_LINES: 5,
  SWIPE_THRESHOLD: 40,
  POLLING_INTERVAL: 15000,
} as const

export const API = {
  TIMEOUT: 5 * 60 * 1000,
  RETRY_COUNT: 0,
  CACHE_TTL: {
    STADIONS: 60,
    FACILITIES: 300,
    FIELDS: 60,
    BOOKINGS: 30,
  },
} as const

export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  DISPLAY_SHORT: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMMM YYYY, HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  TIME_ONLY: 'HH:mm',
  WEEKDAY: 'dddd',
  WEEKDAY_SHORT: 'ddd',
} as const

export const MESSAGES = {
  ERROR: {
    GENERIC: 'Terjadi kesalahan. Silakan coba lagi.',
    NETWORK: 'Koneksi bermasalah. Periksa internet Anda.',
    UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
    NOT_FOUND: 'Data tidak ditemukan.',
    SERVER: 'Server sedang bermasalah. Coba beberapa saat lagi.',
    SLOT_CONFLICT: 'Slot waktu sudah dibooking. Silakan pilih slot lain.',
    INVALID_LOGIN: 'Email atau password yang Anda masukkan salah.',
    SQL_INJECTION: 'Segala bentuk aktivitas mencurigakan telah dibatasi oleh sistem. Mohon masukkan kredensial dengan format yang benar!',
  },
  SUCCESS: {
    GENERIC: 'Operasi berhasil!',
    SAVE: 'Data berhasil disimpan.',
    DELETE: 'Data berhasil dihapus.',
    UPDATE: 'Data berhasil diperbarui.',
  },
} as const
