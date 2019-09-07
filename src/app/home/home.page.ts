import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { AdmobManagerService } from '../services/admob-manager.service';
import { AuthenticationService } from '../services/authentication.service';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  constructor(
    private _admobManager: AdmobManagerService, // to load ads
    private _authenticationService: AuthenticationService,
    private _platform: Platform,
    private _alertController: AlertController
  ) { }

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

  async confirmLogOut() {
    const alert = await this._alertController.create({
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });
    await alert.present();
  }

  logOut() {
    this._authenticationService.logOut().then(() => {
      console.log("User logged out successfully");
      window.location.reload();
    }).catch((error) => {
      console.error("Log Out Error :", error);
    });
  }

  // logOut() {
  //   this._authenticationService.logOut().subscribe(() => {
  //     console.log("User logged out successfully");
  //     window.location.reload();
  //   },
  //   (error) => {
  //     console.error("Log Out Error :", error);
  //   });
  // }

}
