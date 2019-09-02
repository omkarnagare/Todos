import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'settings',
    children: [
      {
        path: '',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'theme-controller',
        loadChildren: () => import('./theme-controller/theme-controller.module').then(m => m.ThemeControllerPageModule)
      },
      {
        path: 'about-dev',
        loadChildren: () => import('./about-dev/about-dev.module').then(m => m.AboutDevPageModule)
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () =>
          import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsPageModule)
      },
      {
        path: 'faqs',
        loadChildren: () =>
          import('./faqs/faqs.module').then(m => m.FaqsPageModule)
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(m => m.ContactUsPageModule)
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
