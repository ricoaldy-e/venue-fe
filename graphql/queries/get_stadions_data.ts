export const QUERY_STADIONS_DATA = `
  query StadionsData {
    stadions {
      id
      name
      description
      mapUrl
      status
      operatingHours {
        openHour
        closeHour
      }
      facilities {
        Facility {
          id
          name
        }
      }
      images {
        id
        imageUrl
      }
      fields {
        id
        name
        pricePerHour
        priceTendik
        images {
          id
          imageUrl
        }
        bookingDetails {
          bookingId
        }
      }
    }
  }
`