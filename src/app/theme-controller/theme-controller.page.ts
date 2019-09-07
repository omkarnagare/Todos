import { Component, OnInit } from '@angular/core';
import { ThemingService } from '../services/theming.service';
import { TodosAppConstants } from '../constants';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-theme-controller',
  templateUrl: './theme-controller.page.html',
  styleUrls: ['./theme-controller.page.scss'],
})
export class ThemeControllerPage implements OnInit {

  ngOnInit() {
  }

  themes: any = [];
  loader: any = null;

  constructor(
    private _themingService: ThemingService,
    private _loaderManager: LoaderManagerService
  ) {
    this.themes = this.processThemes();
  }

  processThemes() {
    const themes = [];
    Object.keys(TodosAppConstants.THEMES).forEach(function (key) {
      themes.push({
        name: key,
        color: TodosAppConstants.THEMES[key]["primary"]
      });
    });
    return [...themes];
  }

  setTheme(name) {
    this._loaderManager.presentLoader().then(() => {
      this._themingService.setTheme(name);
      this._loaderManager.stopLoader();
    });
  }

}
