import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./pages/authentication/authentication.routes').then(r => r.AUTHENTICATION_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
  },
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  }
];
