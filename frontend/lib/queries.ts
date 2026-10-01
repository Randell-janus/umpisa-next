import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        fullName
        role
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      fullName
      role
    }
  }
`;
