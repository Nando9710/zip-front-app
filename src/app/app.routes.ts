import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';

export const ROUTES: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./pages/authentication/authentication.routes').then(r => r.AUTHENTICATION_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
