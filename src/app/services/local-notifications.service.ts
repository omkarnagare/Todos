import { Injectable } from '@angular/core';

import { Plugins, LocalNotificationScheduleResult, LocalNotification } from '@capacitor/core';
import { NotificationConfig, Todo } from '../types';
import { TodosAppConstants } from '../constants';
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

  async processTodosForNotifications(todos: Todo[]) {
    let pendingTasksCount: number = 0;
    let highPriorityTasksCount: number = 0; 
    const pendingTasks = todos.filter(todo => {
      if (todo.isPending) {
        return true;
      } else {
        return false;
      }
    });
    pendingTasksCount = pendingTasks.length;
    const highPriorityTask = pendingTasks.filter(todo => {
      if (todo.priority === "high") {
        return true;
      } else {
        return false;
      }
    });
    highPriorityTasksCount = highPriorityTask.length;

    let message = null;
    if (highPriorityTasksCount > 0) {
      message = "Your "+ highPriorityTasksCount + " high priority tasks are pending.";
    } else {
      message = "You have "+ pendingTasksCount + " pending tasks.";
    }

    if (pendingTasksCount > 0) {
      this.scheduleNotification({
        title: "Reminder from Mr.Todos",
        body: message
      });
    }
  }

  async scheduleNotification(notificationConfig: NotificationConfig) {

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(9, 0, 0);

    const notification = { ...this.notificationOptions };
    notification.title = notificationConfig.title
    notification.body = notificationConfig.body
    notification.id = TodosAppConstants.TODO_LOCAL_NOTIFICATION_ID;
    notification.schedule = { at: tomorrow };

    await LocalNotifications.schedule({
      notifications: [
        notification
      ]
    });
  }
}
