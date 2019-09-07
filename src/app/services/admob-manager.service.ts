import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { AdOptions, AdSize, AdPosition } from 'capacitor-admob';
const { AdMob } = Plugins;

import { environment } from 'src/environments/environment';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root'
})
export class AdmobManagerService {

  isAndroid: boolean = false;
  isBannerAdRequested: boolean = false;
  isInterStitialAdRequested: boolean = false;

  constructor(
    private _deviceInfoService: DeviceInfoService
  ) {
    this._deviceInfoService.fetchDeviceInfo().then(() => {
      this.isAndroid = this._deviceInfoService.isAndroid();
      if (this.isAndroid) {
        AdMob.initialize(environment.admobConfig.APP_ID);
        this.showBannerAd();
        this.showInterstitialAd();
      }
    });
  }

  async showBannerAd() {
    if (this.isAndroid && !this.isBannerAdRequested) {
      const bannerAdConfig: AdOptions = { ...environment.admobConfig.BANNER_AD_CONFIG };
      bannerAdConfig.position = AdPosition.BOTTOM_CENTER;
      bannerAdConfig.adSize = AdSize.SMART_BANNER;

      AdMob.showBanner(bannerAdConfig)
        .then(
          (value) => {
            console.log(value);  // true
            this.isBannerAdRequested = true;
          },
          (error) => {
            console.error(error); // show error
          }
        );
      AdMob.addListener('onAdLoaded', (info: any) => {
        console.log("Banner Ad Loaded", info);
      });
      AdMob.addListener('onAdFailedToLoad', (info: any) => {
        console.log("Banner Ad Failed to load", info);
      });
    }
  }

  async showInterstitialAd() {
    if (this.isAndroid && !this.isInterStitialAdRequested) {

      const interStitialAdConfig: AdOptions = { ...environment.admobConfig.INTERSTITIAL_AD_CONFIG };
      // interStitialAdConfig.position = AdPosition.BOTTOM_CENTER;
      // interStitialAdConfig.adSize = AdSize.SMART_BANNER;

      AdMob.prepareInterstitial(interStitialAdConfig)
        .then(
          (value) => {
            console.log(value);  // true
            this.isInterStitialAdRequested = true;
          },
          (error) => {
            console.error(error); // show error
          }
        );
      AdMob.addListener('onAdLoaded', (info: any) => {
        console.log("Interstitial Ad Loaded", info);
        AdMob.showInterstitial().then(
          (value) => {
            console.log(value);  // true
          },
          (error) => {
            console.error(error); // show error
          }
        );
      });
      AdMob.addListener('onAdFailedToLoad', (info: any) => {
        console.log("Interstitial Ad Failed to load", info);
      });
    }
  }
}
