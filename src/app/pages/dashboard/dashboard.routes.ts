import { Route } from "@angular/router";

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: 'files',
        loadComponent: () => import('./pages/files/files.component').then((c) => c.FilesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then((c) => c.UsersComponent)
      },
      {
        path: '',
        redirectTo: 'files',
        pathMatch: 'full'
      }
    ]
  }
];
