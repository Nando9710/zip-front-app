import { Route } from "@angular/router";

export const AUTHENTICATION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./authentication.component').then(c => c.AuthenticationComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
