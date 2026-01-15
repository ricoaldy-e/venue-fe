import gql from "graphql-tag";

export const QUERY_GET_OPTION = gql`
    query Options {
        options {
            address
            description
            email
            name
            nohp
        }
    }
`