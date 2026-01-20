import gql from "graphql-tag";

export const QUERY_GET_OPTION = gql`
    query Options {
        options {
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