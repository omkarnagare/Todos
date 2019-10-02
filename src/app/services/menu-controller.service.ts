import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SideMenu } from '../types';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MenuControllerService implements OnDestroy {

  /**
   * I have also set the replaySubject to have a buffer size of 1. 
   * This is because I just want a unique observable for the menu, and don’t need any caching capabilities.
   */
  menuItemsChanges$: ReplaySubject<SideMenu[]>;

  constructor(
    private _menuController: MenuController
  ) {
    this.menuItemsChanges$ = new ReplaySubject<SideMenu[]>(1);
  }

  pushMenuItems(menuItems: SideMenu[]) {
    this.menuItemsChanges$.next(menuItems);
  }

  ngOnDestroy() {
    this.menuItemsChanges$.complete();
    this.menuItemsChanges$ = null;
  }

  toggleMenu() {
    this._menuController.toggle();
  }
}
