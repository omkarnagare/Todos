import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
const { Toast } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ToastManagerService {

  constructor(
    private _toastController: ToastController
  ) { }

  async presentToast(text: string) {
    await Toast.show({
      text: text
    });
  }

  showToast(message: any, duration = 2000) {
    const toast = this._toastController.create({
      message: message,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "dismiss",
      color: "primary",
      cssClass: "todos-toast"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }

  showErrorToast(error: any, duration = 2000) {
    console.error(error);
    const toast = this._toastController.create({
      message: error.message ? error.message : error,
      duration: duration,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "dismiss",
      color: "danger",
      cssClass: "todos-toast"
    });
    toast.then((toastMessage) => {
      toastMessage.present();
    });
  }
}
