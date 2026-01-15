export const QUERY_GET_BOOKINGS = `
  query Bookings($stadionId: ID, $date: DateTime, $startDate: DateTime, $endDate: DateTime) {
    bookings(stadionId: $stadionId, date: $date, startDate: $startDate, endDate: $endDate) {
      id
      bookingCode
      name
      contact
      email
      isAcademic
      status
      paymentStatus
      totalPrice
      createdAt
      details {
        fieldId
        bookingDate
        startHour
        subtotal
        Field {
          id
          name
          stadionId
          Stadion {
            id
            name
          }
        }
      }
    }
  }
`