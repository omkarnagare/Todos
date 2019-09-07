import { Injectable } from '@angular/core';

import { Plugins, DeviceInfo } from '@capacitor/core';
import { TodosAppConstants } from '../constants';
const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  deviceInfo: DeviceInfo = null;

  constructor() {
    this.fetchDeviceInfo();
  }

  async fetchDeviceInfo() {
    if (null === this.deviceInfo) {
      const info = await Device.getInfo();
      console.log("device details: ", info);
      this.deviceInfo = { ...info };
    }
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    await this.fetchDeviceInfo();
    return this.deviceInfo;
  }

  getAppDetails() {
    return TodosAppConstants.APP_NAME + "-v" + this.deviceInfo.appVersion;
  }

  getAppVersion() {
    return this.deviceInfo.appVersion;
  }

  getDeviceDetails() {
    return this.deviceInfo.model + "-" + this.deviceInfo.osVersion + ":" + this.deviceInfo.manufacturer;
  }

  isAndroid(): boolean {
    return this.deviceInfo.platform === "android";
  }

  isIOS(): boolean {
    return this.deviceInfo.platform === "ios";
  }

  isElectron(): boolean {
    return this.deviceInfo.platform === "electron";
  }

  isPWA(): boolean {
    return this.deviceInfo.platform === "web";
  }

  isMobilePlatform(): boolean {
    return this.isAndroid() || this.isIOS();
  }

}
