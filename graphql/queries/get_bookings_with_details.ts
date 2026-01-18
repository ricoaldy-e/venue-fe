export const QUERY_BOOKINGS_WITH_DETAILS = `
  query BookingsWithDetails($startDate: DateTime, $endDate: DateTime) {
    bookings(startDate: $startDate, endDate: $endDate) {
      data {
        id
        bookingCode
        status
        details {
          id
          fieldId
          bookingDate
          startHour
        }
      }
    }
  }
`