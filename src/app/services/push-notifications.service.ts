import { Injectable, OnInit, OnDestroy } from '@angular/core';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
import { LocalNotificationsService } from './local-notifications.service';
import { DeviceInfoService } from './device-info.service';
import { AlertController } from '@ionic/angular';
import { TodosAppConstants } from '../constants';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService implements OnInit, OnDestroy {

  isMobilePlatform: boolean = false;
  isAlreadyRegistered: boolean = false;

  constructor(
    private _deviceInfoService: DeviceInfoService,
    private _alertController: AlertController
  ) {
  }

  async registerPushNotifications() {

    if (!this.isAlreadyRegistered) {
      this._deviceInfoService.fetchDeviceInfo().then(() => {
        this.isMobilePlatform = this._deviceInfoService.isMobilePlatform();
        if (this.isMobilePlatform) {

          PushNotifications.register().then(() => {

            this.isAlreadyRegistered = true;

            PushNotifications.addListener('registration',
              (token: PushNotificationToken) => {
                console.log('Push registration success, token: ' + token.value);
              }
            );

            PushNotifications.addListener('registrationError',
              (error: any) => {
                console.error('Error on registration: ' + JSON.stringify(error));
              }
            );

            PushNotifications.addListener('pushNotificationReceived',
              (notification: PushNotification) => {
                console.log('Push received: ' + JSON.stringify(notification));
                // alert('Push received: ' + JSON.stringify(notification));
                this.showAlert(notification);
              }
            );

            PushNotifications.addListener('pushNotificationActionPerformed',
              (notification: PushNotificationActionPerformed) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
              }
            );
          });
        }
      });
    }
  }

  async showAlert(notification: PushNotification) {
    const alert = await this._alertController.create({
      header: TodosAppConstants.PUSH_NOTIFICATION_TITLE,
      subHeader: notification.title,
      message: notification.body,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
