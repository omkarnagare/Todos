import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddTodoPage } from './add-todo.page';
import { ScrollVanishDirectiveModule } from '../directives/scroll-vanish.directive.module';

const routes: Routes = [
  {
    path: '',
    component: AddTodoPage
  }
];

@NgModule({
  imports: [
    ScrollVanishDirectiveModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddTodoPage]
})
export class AddTodoPageModule {}
