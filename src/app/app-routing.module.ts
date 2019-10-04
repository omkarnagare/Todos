import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanEnterLogInPageGuard } from './guards/can-enter-log-in-page.guard';
import { CanEnterAppGuard } from './guards/can-enter-app.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'add-todo',
        loadChildren: () => import('./add-todo/add-todo.module').then(m => m.AddTodoPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'details/:todoId',
        loadChildren: () => import('./todo-details/todo-details.module').then(m => m.TodoDetailsPageModule),
        canActivate: [CanEnterAppGuard]
      }
    ]
  },
  {
    path: 'history',
    children: [
      {
        path: '',
        loadChildren: () => import('./todo-history/todo-history.module').then(m => m.TodoHistoryPageModule),
        canActivate: [CanEnterAppGuard]
      }
    ]
  },
  {
    path: 'log-in',
    children: [
      {
        path: '',
        loadChildren: () => import('./log-in/log-in.module').then(m => m.LogInPageModule),
        canActivate: [CanEnterLogInPageGuard],
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule),
        canActivate: [CanEnterLogInPageGuard]
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsPageModule),
        canActivate: [CanEnterLogInPageGuard]
      }
    ]
  },
  {
    path: 'account-details',
    children: [
      {
        path: '',
        loadChildren: () => import('./account-details/account-details.module').then(m => m.AccountDetailsPageModule),
        canActivate: [CanEnterAppGuard]
      }
    ]
  },
  {
    path: 'settings',
    children: [
      {
        path: '',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'theme-controller',
        loadChildren: () => import('./theme-controller/theme-controller.module').then(m => m.ThemeControllerPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'about-dev',
        loadChildren: () => import('./about-dev/about-dev.module').then(m => m.AboutDevPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'faqs',
        loadChildren: () =>
          import('./faqs/faqs.module').then(m => m.FaqsPageModule),
        canActivate: [CanEnterAppGuard]
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(m => m.ContactUsPageModule),
        canActivate: [CanEnterAppGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
