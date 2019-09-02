import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ToastManagerService {

  constructor() { }

  async presentToast(text: string) {
    await Toast.show({
      text: text
    });
  }
}
