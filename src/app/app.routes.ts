import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./layouts/external-layout/external-layout').then((m) => m.ExternalLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('../app/pages/external/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./layouts/external-layout/external-layout').then((m) => m.ExternalLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/external/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
    ],
  },

  {
    path: 'resetPassword',
    loadComponent: () =>
      import('./layouts/external-layout/external-layout').then((m) => m.ExternalLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/external/reset-password/reset-password').then((m) => m.ResetPassword),
      },
    ],
  },

  {
    path: 'app',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layouts/private-layout/private.routes').then((m) => m.PRIVATE_ROUTES),
  },
  { path: '**', redirectTo: '/app' },
];
