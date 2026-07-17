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
      { path: '', loadComponent: () => import('./pages/external/login').then((m) => m.default) },
    ],
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadChildren:() => import('./layouts/private-layout/private.routes').then(m => m.PRIVATE_ROUTES)
  },
  { path: '**', redirectTo: '/app' },
];
