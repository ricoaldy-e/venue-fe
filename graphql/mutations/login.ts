export const MUTATION_LOGIN = `
  mutation Login($email: String!, $password: String!, $turnstile: String!) {
    login(email: $email, password: $password, turnstile: $turnstile) {
      token
      admin { id name email }
    }
  }
`