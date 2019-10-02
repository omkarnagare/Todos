import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ThemingService } from './services/theming.service';
import { MenuControllerService } from './services/menu-controller.service';
import { Subscription } from 'rxjs';
import { SideMenu } from './types';
import { TodosAppConstants } from './constants';
import { PushNotificationsService } from './services/push-notifications.service';
import { UsersManagerService } from './services/users-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  appPages: SideMenu[] = [];
  menuItemChanges$: Subscription;

  userProfile: any = null;
  userProfile$: Subscription;
  defaultImage: string = TodosAppConstants.USER_DEFAULT_IMAGE;

  constructor(
    private _themingService: ThemingService, // to load theme
    private _pushNotifications: PushNotificationsService,
    private _menuControllerService: MenuControllerService,
    private _usersService: UsersManagerService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this._pushNotifications.registerPushNotifications();
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

  toggleMenu() {
    this._menuControllerService.toggleMenu();
  }

  ngAfterViewInit() {
    this.userProfile$ = this._usersService.getUserProfile().subscribe(data => {
      console.log("userProfile", data);
      this.userProfile = data;
    });
  }

  ngOnDestroy() {
    if (this.menuItemChanges$) {
      this.menuItemChanges$.unsubscribe();
      this.menuItemChanges$ = null;
    }

    if (this.userProfile$) {
      this.userProfile$.unsubscribe();
      this.userProfile$ = null;
      this.userProfile = null;
    }
  }
}
