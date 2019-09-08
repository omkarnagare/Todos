import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { OnlineSharingManagerService } from '../services/online-sharing-manager.service';
import { TodosAppConstants } from '../constants';
import { DeviceInfoService } from '../services/device-info.service';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
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
        text: "Hello there!! I am using Todos to help me manage my tasks. It's simply amazing and very easy to use. To install, use the following link : ",
        dialogTitle: this.getTitle()
      }).finally(() => {
        this._loaderManager.stopLoader();
      });
    });
  }

  getTitle() {
    return "Welcome to the world of " + TodosAppConstants.APP_NAME;
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
