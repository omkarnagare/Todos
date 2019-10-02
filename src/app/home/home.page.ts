import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { LocalNotificationsService } from '../services/local-notifications.service';
import { ConfirmExitService } from '../services/confirm-exit.service';
import { PinVerificationService } from '../services/pin-verification.service';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { PIN_STATE } from '../constants';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  constructor(
    private _platform: Platform,
    private _pinVerification: PinVerificationService,
    private _localNotification: LocalNotificationsService,
    private _confirmExitService: ConfirmExitService,
    private _modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._pinVerification.isVerified().then((data) => {
      if (data.verified) {
        // safe to go ahead
      } else {
        this.openPinVerifyModal(data.pin);
      }
      SplashScreen.hide();
    });
  }

  async openPinVerifyModal(expectedPIN: string = "") {
    console.log(expectedPIN);
    const pinModalOfHome = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: {
        title: "Enter PIN",
        pinSetupState: PIN_STATE.VERIFY_PIN,
        expectedPIN: expectedPIN
      },
      backdropDismiss: false // user cannot dissmiss by clicking outside
    });
    pinModalOfHome.onDidDismiss()
      .then((data) => {
        this._pinVerification.verified = true;
      });
    return await pinModalOfHome.present();
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      this._confirmExitService.confirmExit();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.backButtonSubscription$ = null;
  }

  async showLocalNotification() {
    await this._localNotification.showNotification({
      title: 'Mr.Todos Notification',
      body: 'This is a sample notification',
      id: 1
    });
  }

}
