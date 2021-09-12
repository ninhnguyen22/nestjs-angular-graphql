import gql from 'graphql-tag';

export const getNotificationsQuery = gql`
  query getNotificationsQuery {
    notifications {
      notifications {
        userId
        message
        createdAt
      }
      count
    }
  }`
;

export const notificationSubscription = gql`
  subscription notifycation {
    notify {
      message
      userId
      createdAt
    }
  }
`;

export const notificationAdminSubscription = gql`
  subscription notifycationAdmin {
    notifyAdmin {
      message
      userId
      createdAt
    }
  }
`;

export const updateLastNotifyAtMutation = gql`
  mutation lasNotifyUpdate(
    $lastNotifyAt: String!
  ) {
    lasNotifyUpdate(
      lastNotifyAt: $lastNotifyAt
    )
  }
`;
