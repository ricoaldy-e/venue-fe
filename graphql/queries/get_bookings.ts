export const QUERY_GET_BOOKINGS_PAGINATED = `
  query BookingsPaginated(
    $page: Int
    $limit: Int
    $sortOrder: String
    $status: BookingStatus
    $paymentStatus: PaymentStatus
    $renterType: RenterType
    $search: String
    $stadionId: ID
    $date: DateTime
    $startDate: DateTime
    $endDate: DateTime
  ) {
    bookings(
      page: $page
      limit: $limit
      sortOrder: $sortOrder
      status: $status
      paymentStatus: $paymentStatus
      renterType: $renterType
      search: $search
      stadionId: $stadionId
      date: $date
      startDate: $startDate
      endDate: $endDate
    ) {
      data {
        id
        bookingCode
        name
        contact
        email
        renterType
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
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
      summary {
        totalRevenue
        totalCount
        paidCount
        unpaidCount
        umumCount
        tendikCount
        academicCount
        nonAcademicCount
        academicRevenue
        nonAcademicRevenue
        paidPercentage
        averagePerBooking
        approvedCount
        cancelledCount
        pendingCount
      }
    }
  }
`

// Query for backward compatibility (tanpa summary)
export const QUERY_GET_BOOKINGS = `
  query Bookings($stadionId: ID, $date: DateTime, $startDate: DateTime, $endDate: DateTime) {
    bookings(stadionId: $stadionId, date: $date, startDate: $startDate, endDate: $endDate) {
      data {
        id
        bookingCode
        name
        contact
        email
        renterType
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
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
`