export const QUERY_GET_STADION_BY_ID = `
  query GetStadionById($stadionId: ID!) {
    stadion(stadionId: $stadionId) {
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
          icon
        }
      }
      images {
        id
        imageUrl
      }
      fields {
        id
        name
        description
        pricePerHour
        priceTendik
        status
        images {
          id
          imageUrl
        }
      }
    }
  }
`