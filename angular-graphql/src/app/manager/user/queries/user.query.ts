import gql from 'graphql-tag';

export const getUsersQuery = gql`
  query getUsersQuery {
    users {
      _id
      name
      email
      avatar
      createdAt
      roles {
        name
        code
      }
    }
  }`
;

export const getUserQuery = gql`
  query getUserQuery(
    $_id: String!
  ) {
    user(
      _id: $_id
    ) {
      _id
      name
      email
      avatar
      roles {
        code
      }
      createdAt
    }
  }`
;

export const getRolesQuery = gql`
  query getRolesQuery {
    roles {
      name
      code
    }
  }`
;

export const createUserMutation = gql`
  mutation userCreate(
    $name: String!
    $email: String!
    $password: String!
    $roles: [String]
  ) {
    userCreate(
      input: {
        name: $name
        email: $email
        password: $password
        roles: $roles
      }
    ) {
      _id
      name
      email
      createdAt
    }
  }
`;

export const updateUserMutation = gql`
  mutation userUpdate(
    $_id: String!
    $name: String!
    $password: String!
    $roles: [String]
  ) {
    userUpdate(
      _id: $_id
      input: {
        name: $name
        password: $password
        roles: $roles
      }
    )
  }
`;

export const deleteUserMutation = gql`
  mutation usersDelete($_id: String!) {
    userDelete(_id: $_id)
  }
`;
