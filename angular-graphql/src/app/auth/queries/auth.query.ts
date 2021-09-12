import gql from 'graphql-tag';

export const loginMutation = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: {
      email: $email,
      password: $password,
    }) {
      token,
      refreshToken,
      user {
        _id
        name
        email
        avatar
        roles {
          name
          code
        }
      }
    }
  }`
;

export const refreshTokenMutation = gql`
  mutation refreshTokenQuery($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
    }
  }`
;

