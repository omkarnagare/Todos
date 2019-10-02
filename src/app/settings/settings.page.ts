import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { OnlineSharingManagerService } from '../services/online-sharing-manager.service';
import { TodosAppConstants } from '../constants';
import { DeviceInfoService } from '../services/device-info.service';
import { LoaderManagerService } from '../services/loader-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class SettingsPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  appVersion: string;
  isMobilePlatform: boolean = false;

  constructor(
    private _platform: Platform,
    private _sharingManagerService: OnlineSharingManagerService,
    private _loaderManager: LoaderManagerService,
    private _deviceInfoService: DeviceInfoService
  ) {
  }

  ionViewDidEnter() {
    this._deviceInfoService.fetchDeviceInfo().then(() => {
      this.appVersion = this._deviceInfoService.getAppVersion();
      this.isMobilePlatform = this._deviceInfoService.isMobilePlatform();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.backButtonSubscription$ = null;
  }

  share() {
    this._loaderManager.presentLoader().then(() => {
      this._sharingManagerService.share({
        title: this.getTitle(),
        text: "Hello there!! I am using Mr.Todos to help me manage my tasks. It's simply amazing and very easy to use. To install, use the following link : ",
        dialogTitle: this.getTitle(),
        url: this.getAppURL()
      }).finally(() => {
        this._loaderManager.stopLoader();
      });
    });
  }

  getAppURL(): string {
    // TODO: change URLS
    if (this._deviceInfoService.isMobilePlatform()) {
      if (this._deviceInfoService.isAndroid()) {
        return "https://play.google.com/store/apps/details?id=com.nagare.balkrishna.omkar.borrowed";
      } else if (this._deviceInfoService.isIOS()) {
        return "https://borrowed-o20121991.firebaseapp.com/";
      }
    }
    return null;
  }

  getTitle() {
    return "Welcome to the world of " + TodosAppConstants.APP_NAME;
  }
}
