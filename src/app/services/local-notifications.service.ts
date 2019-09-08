import { Injectable } from '@angular/core';

import { Plugins, LocalNotificationScheduleResult, LocalNotification } from '@capacitor/core';
import { NotificationConfig } from '../types';
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  notificationOptions: any;

  constructor() {
    this.notificationOptions = {
      sound: null,
      attachments: null,
      actionTypeId: "",
      extra: null
    }
  }

  async showNotification(notificationConfig: NotificationConfig): Promise<LocalNotificationScheduleResult> {

    const notification = { ...this.notificationOptions };
    notification.title = notificationConfig.title
    notification.body = notificationConfig.body
    notification.id = notificationConfig.id
    notification.schedule = { at: new Date(Date.now() + 1000 * 5) };

    return await LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });
  }
}
