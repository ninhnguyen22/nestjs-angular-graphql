import { Injectable } from '@angular/core';
import { Apollo } from "apollo-angular";
import { NotifiesQuery, NotifyAdminSubscription, NotifySubscription, UpdateLastNotifyAtMutation } from "./notify.model";

import {
  getNotificationsQuery,
  notificationAdminSubscription,
  notificationSubscription,
  updateLastNotifyAtMutation
} from "./notify.queries";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private apollo: Apollo) {
    this.apollo = apollo;
  }

  subscribeNotify() {
    return this.apollo.subscribe<NotifySubscription>(
      {
        query: notificationSubscription,
      }
    )
  }

  subscribeAdminNotify() {
    return this.apollo.subscribe<NotifyAdminSubscription>(
      {
        query: notificationAdminSubscription,
      }
    );
  }

  getNotifications() {
    return this.apollo.watchQuery<NotifiesQuery>({
      query: getNotificationsQuery,
      variables: {},
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  updateLastNotifyAt(variables) {
    return this.apollo.mutate<UpdateLastNotifyAtMutation>({
      mutation: updateLastNotifyAtMutation,
      variables,
      fetchPolicy: 'no-cache',
      refetchQueries: [],
    });
  }


}
