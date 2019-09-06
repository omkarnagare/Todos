import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemingService } from './services/theming.service';
import { MenuControllerService } from './services/menu-controller.service';
import { Subscription } from 'rxjs';
import { SideMenu } from './types';
import { TodosAppConstants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
  appPages: SideMenu[] = [];
  menuItemChanges$: Subscription;

  constructor(
    private _themingService: ThemingService, // to load theme
    private _menuControllerService: MenuControllerService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.menuItemChanges$ = this._menuControllerService.menuItemsChanges$.subscribe((menuItems) => {
      this.appPages = [...menuItems];
    });
    this._menuControllerService.pushMenuItems(TodosAppConstants.DEFAULT_SIDE_MENU_ITEMS);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnDestroy() {
    this.menuItemChanges$.unsubscribe();
    this.menuItemChanges$ = null;
  }
}
