export interface Notify {
  userId: string
  message: string
  createdAt: string
}

export type NotifiesQuery = {
  notifications: {
    notifications: Notify[];
    count: number;
  }
};

export type NotifySubscription = {
  notify: Notify;
};

export type NotifyAdminSubscription = {
  notifyAdmin: Notify;
};

export type UpdateLastNotifyAtMutation = {
  lasNotifyUpdate: boolean;
};

