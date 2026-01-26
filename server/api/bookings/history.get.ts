import { QUERY_GET_BOOKINGS_PAGINATED } from "~/graphql/queries/get_bookings"

interface BookingSummary {
  totalRevenue: number
  totalCount: number
  paidCount: number
  unpaidCount: number
  academicCount: number
  nonAcademicCount: number
  academicRevenue: number
  nonAcademicRevenue: number
  paidPercentage: number
  averagePerBooking: number
  approvedCount: number
  cancelledCount: number
  pendingCount: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface BookingResponse {
  data?: any[]
  pagination?: PaginationInfo
  summary?: BookingSummary
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = config.public.gqlHttpEndpoint
  if (!endpoint) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GQL_HTTP_ENDPOINT' })
  }

  const token = getCookie(event, 'admin_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  const query = getQuery(event)

  // Helper to convert date string to ISO format for GraphQL DateTime
  // Using UTC+7 (Asia/Jakarta timezone) to ensure correct date filtering
  const toIsoDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined
    if (dateStr.includes('T')) return dateStr
    // Convert to start of day in Asia/Jakarta timezone (UTC+7)
    // 00:00:00 WIB = 17:00:00 UTC (previous day)
    return `${dateStr}T00:00:00.000+07:00`
  }

  const toIsoDateEnd = (dateStr: string | undefined) => {
    if (!dateStr) return undefined
    if (dateStr.includes('T')) return dateStr
    // Convert to end of day in Asia/Jakarta timezone (UTC+7)  
    // 23:59:59 WIB = 16:59:59 UTC (same day)
    return `${dateStr}T23:59:59.999+07:00`
  }

  const variables = {
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
    sortOrder: (query.sortOrder as string) || 'desc',
    status: (query.status as string) || undefined,
    paymentStatus: (query.paymentStatus as string) || undefined,
    renterType: (query.renterType as string) || undefined,
    search: (query.search as string) || undefined,
    stadionId: (query.stadionId as string) || undefined,
    startDate: toIsoDate(query.startDate as string),
    endDate: toIsoDateEnd(query.endDate as string),
    date: toIsoDate(query.date as string),
  }

  try {
    const response = await $fetch<{
      data?: {
        bookings?: BookingResponse
      }
      errors?: Array<{
        message?: string
        extensions?: {
          code?: string
        }
      }>
    }>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: {
        query: QUERY_GET_BOOKINGS_PAGINATED,
        variables
      },
    })

    if (response?.errors?.length) {
      throw createError({
        statusCode: 400,
        statusMessage: response.errors[0]?.message || 'Failed to get bookings history',
      })
    }

    // Return complete response with data, pagination, and summary
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
    }

    return response.data?.bookings || defaultResponse
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: 502, statusMessage: 'Bookings service unreachable' })
  }
})
