export const MUTATION_CREATE_FIELD = `
  mutation CreateField(
    $stadionId: Int!
    $name: String!
    $description: String
    $pricePerHour: Int!
    $priceTendik: Int
    $images: [FieldImageInput!]
    $status: Status
  ) {
    createField(
      stadionId: $stadionId
      name: $name
      description: $description
      pricePerHour: $pricePerHour
      priceTendik: $priceTendik
      images: $images
      status: $status
    ) {
      id
      name
      pricePerHour
      priceTendik
      status
    }
  }
`