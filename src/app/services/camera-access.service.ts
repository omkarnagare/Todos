import { Injectable } from '@angular/core';

import { Plugins, CameraResultType, CameraSource, CameraOptions, CameraDirection, Capacitor } from '@capacitor/core';
import { ImageSourceType } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CameraAccessService {

  cameraOptions: CameraOptions;

  constructor() {
    this.cameraOptions = {
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      correctOrientation: false,
      saveToGallery: false,
      // width: 200,
      // height: 200
    }
  }

  async isCameraAvailable(): Promise<boolean> {
    return await Capacitor.isPluginAvailable('Camera');
  }
  async takePicture(type: ImageSourceType): Promise<string> {

    const options: CameraOptions = { ...this.cameraOptions };
    switch (type) {
      case ImageSourceType.BACK_CAMERA:
        options.source = CameraSource.Camera;
        options.direction = CameraDirection.Rear;
        break;
      case ImageSourceType.FRONT_CAMERA:
        options.source = CameraSource.Camera;
        options.direction = CameraDirection.Front;
        break;
      case ImageSourceType.GALLERY:
        options.source = CameraSource.Photos;
        break;
    }
    console.log("cameraOptions", options);
    const image = await Plugins.Camera.getPhoto(options);
    return image.dataUrl;
  }
}
