export const QUERY_GET_FIELD_BY_ID = `
  query GetFieldById($fieldId: ID!) {
    field(fieldId: $fieldId) {
      id
      stadionId
      name
      description
      pricePerHour
      priceTendik
      status
      images { id imageUrl }
      Stadion { id name }
    }
  }
`
