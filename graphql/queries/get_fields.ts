export const QUERY_GET_FIELDS = `
  query FieldsDashboard($stadionId: ID) {
    fields(stadionId: $stadionId) {
      id
      stadionId
      name
      description
      pricePerHour
      priceTendik
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
`
