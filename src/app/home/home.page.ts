import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit{

  backButtonSubscription$: Subscription;

  constructor(
    private _platform: Platform
  ) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    SplashScreen.hide();
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

}
