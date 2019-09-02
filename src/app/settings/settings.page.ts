import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  appVersion: string;

  constructor(
    private _platform: Platform
  ) {
  }

  ionViewDidEnter() {
    this.appVersion = "0.1";
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
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
