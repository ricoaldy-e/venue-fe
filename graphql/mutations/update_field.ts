export const MUTATION_UPDATE_FIELD = `
  mutation UpdateField(
    $fieldId: ID!
    $stadionId: Int!
    $name: String!
    $description: String
    $pricePerHour: Int!
    $priceTendik: Int
    $images: [FieldImageInput!]
    $status: Status
  ) {
    updateField(
      fieldId: $fieldId
      stadionId: $stadionId
      name: $name
      description: $description
      pricePerHour: $pricePerHour
      priceTendik: $priceTendik
      images: $images
      status: $status
    ) {
      id
      stadionId
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
`