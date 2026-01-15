import gql from "graphql-tag";

export const MUTATION_UPDATE_OPTION = gql`
    mutation UpdateOption($name: String!, $description: String!, $email: String!, $nohp: String!, $address: String!) {
        updateOption(name: $name, description: $description, email: $email, nohp: $nohp, address: $address) {
            id
            name
            description
            email
            nohp
            address
        }
    }
`