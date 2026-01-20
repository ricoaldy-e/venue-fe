import gql from "graphql-tag";

export const MUTATION_UPDATE_OPTION = gql`
    mutation UpdateOption($name: String!, $nameKet: String!, $description: String!, $unitName: String!, $unitDesc: String!, $email: String!, $nohp: String!, $address: String!) {
        updateOption(name: $name, nameKet: $nameKet, description: $description, unitName: $unitName, unitDesc: $unitDesc, email: $email, nohp: $nohp, address: $address) {
            id
            name
            nameKet
            description
            unitName
            unitDesc
            email
            nohp
            address
        }
    }
`