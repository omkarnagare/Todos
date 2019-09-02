import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ClipboardManagerService {

  constructor() { }

  async write(message: string): Promise<void> {
    return await Clipboard.write({
      string: message
    });
  }

  async copyString(): Promise<string> {
    let str = await Clipboard.read({
      type: 'string'
    });
    console.log('Got string from clipboard:', str.value);
    return str.value;
  }

  async copyURL(): Promise<string> {
    let url = await Clipboard.read({
      type: 'url'
    });
    console.log('Got URL from clipboard:', url.value);
    return url.value;
  }

  async copyImage(): Promise<string> {
    let image = await Clipboard.read({
      type: 'image'
    });
    console.log('Got image from clipboard:', image.value);
    return image.value;
  }
}
