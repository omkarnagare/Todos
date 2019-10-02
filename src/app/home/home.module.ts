import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { PinUnlockPageModule } from '../pin-unlock/pin-unlock.module';
import { ScrollVanishDirectiveModule } from '../directives/scroll-vanish.directive.module';

@NgModule({
  imports: [
    ScrollVanishDirectiveModule,
    PinUnlockPageModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
