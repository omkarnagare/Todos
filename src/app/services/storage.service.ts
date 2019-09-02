import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setObject(key: string, value: any): Promise<any> {
    const object = JSON.stringify(value);
    await Storage.set({
      key: key,
      value: object
    });
    console.log('Set object: ', object, 'for key: ', key);
    return object;
  }

  // JSON "get" example
  async getObject(key: string): Promise<any> {
    const ret = await Storage.get({ key: key });
    console.log('Got object: ', ret.value);
    return JSON.parse(ret.value);
  }

  async setString(key: string, value: string): Promise<string> {
    await Storage.set({
      key: key,
      value: value
    });
    console.log('Set string: ', value, 'for key: ', key);
    return value;
  }

  async getString(key: string): Promise<string> {
    const item = await Storage.get({ key: key });
    console.log('Got string: ', item);
    return item.value;
  }

  async removeItem(key: string) {
    await Storage.remove({ key: key });
  }

  async keys(): Promise<{
    keys: string[];
  }> {
    const keys = await Storage.keys();
    console.log('Got keys: ', keys);
    return keys;
  }

  async clear(): Promise<void> {
    return await Storage.clear();
  }

}
