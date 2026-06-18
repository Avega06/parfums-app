import { Routes } from '@angular/router';
import { authGuard, authInversedGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./shared/layouts/auth-layout/auth-layout'),
    children: [
      {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () => import('./pages/auth/login/login'),
        canActivate: [authInversedGuard],
      },
      {
        path: 'signup',
        title: 'Crear Cuenta',
        loadComponent: () => import('./pages/auth/signup/signup'),
        canActivate: [authInversedGuard],
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./pages/auth/verify-email/verify-email'),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/MainLayout.component'),
    children: [
      {
        path: 'parfums/:page',
        title: 'Listado de Perfumes',
        loadComponent: () =>
          import('./pages/parfum-list/parfum-list.component'),
      },
      {
        path: 'product/:product_id',
        title: 'Listado de Perfumes',
        loadComponent: () => import('./pages/product/product.component'),
      },
      {
        path: 'user/product-list',
        title: 'Mis Perfumes',
        loadComponent: () =>
          import('./pages/user/product-list/product-list-page'),
        canActivate: [authGuard],
      },
      {
        path: 'access-denied',
        title: 'Acceso denegado',
        loadComponent: () =>
          import('./shared/pages/errors/access-denied/access-denied-page'),
      },
      {
        path: 'not-found',
        title: 'Pagina no encontrada',
        loadComponent: () =>
          import('./shared/pages/errors/not-found/not-found-page'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'parfums/1',
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];
