import gql from 'graphql-tag';

export const getProfileQuery = gql`
  query getProfileQuery {
    me {
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

export const updateProfileMutation = gql`
  mutation updateProfileMutation(
    $name: String
    $email: String
  ) {
    profileUpdate(
      input: {
        name: $name
        email: $email
      }
    )
  }
`;

export const updatePwMutation = gql`
  mutation updatePwMutation(
    $oldPassword: String!
    $newPassword: String!
  ) {
    profilePwUpdate(
      input: {
        oldPassword: $oldPassword
        newPassword: $newPassword
      }
    )
  }
`;

export const updateAvatarMutation = gql`
  mutation updateAvatarMutation(
    $file: Upload!
  ) {
    profileAvatarUpdate(
      file: $file
    )
  }
`;

